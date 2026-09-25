import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { LEAD_ENUMS, LEAD_TEXT_FIELDS, type Lead } from "@/lib/lead";

export const runtime = "nodejs";

const client = new Anthropic();
const MODEL = process.env.ASSISTANT_MODEL || "claude-haiku-4-5";
const MAX_TURNS = 40;
const MAX_CHARS = 2000;

const FALLBACK = "Momentan nu pot răspunde. Poți continua solicitarea folosind opțiunile de mai jos.";

const properties: Record<string, { type: "string"; enum?: readonly string[] }> = {};
for (const k of LEAD_TEXT_FIELDS) properties[k] = LEAD_ENUMS[k] ? { type: "string", enum: LEAD_ENUMS[k] } : { type: "string" };

const tools: Anthropic.Tool[] = [
  {
    name: "set_lead_fields",
    description: "Salvează în solicitare informațiile oferite de vizitator.",
    input_schema: { type: "object", properties },
  },
];

type InMsg = { role: "user" | "assistant"; content: string };

function systemPrompt(step: string, lead: Lead) {
  return `Ești asistentul de evaluare VALUEFY — firmă de evaluări imobiliare autorizată ANEVAR, activă în Timișoara și vestul României, cu servicii la nivel național. Funcționezi ca un formular conversațional ghidat.
Pasul curent în interfață: ${step}. Date colectate: ${JSON.stringify(lead)}.
Dacă utilizatorul oferă informații, apelează set_lead_fields cu valori normalizate (pentru câmpurile enum folosește exact una dintre opțiuni; suprafețele doar ca număr; deadline: "Standard", "Urgent" sau o dată).
Apoi răspunde în română, cald și profesionist, în maxim 2 propoziții scurte. NU pune următoarea întrebare — interfața o afișează automat. Nu oferi prețuri, valori estimate sau termene exacte: costul și termenul sunt comunicate în ofertă, pentru că depind de tipul proprietății, scop, localizare și complexitate. Nu afirma că ai verificat autenticitatea documentelor. Fără markdown.`;
}

// Normalise what the model extracted: keep non-empty strings, respect enums.
function cleanFields(input: unknown): Lead {
  const out: Record<string, string | boolean> = {};
  if (!input || typeof input !== "object") return {};
  for (const [k, v] of Object.entries(input as Record<string, unknown>)) {
    if (!(LEAD_TEXT_FIELDS as readonly string[]).includes(k) || v == null) continue;
    const s = String(v).trim();
    if (!s) continue;
    const allowed = LEAD_ENUMS[k as keyof typeof LEAD_ENUMS];
    if (allowed && !allowed.includes(s)) continue;
    out[k] = s.slice(0, 300);
  }
  if (out.surface_area || out.land_area) out.details_done = true;
  return out as Lead;
}

export async function POST(req: Request) {
  let body: { messages?: InMsg[]; step?: string; lead?: Lead };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  // Build an alternating history that starts with a user turn.
  const history: Anthropic.MessageParam[] = [];
  for (const m of (body.messages || []).slice(-MAX_TURNS)) {
    if (m.role !== "user" && m.role !== "assistant") continue;
    const text = String(m.content || "").slice(0, MAX_CHARS);
    if (!text) continue;
    if (!history.length && m.role === "assistant") continue;
    const last = history[history.length - 1];
    if (last && last.role === m.role) last.content += "\n" + text;
    else history.push({ role: m.role, content: text });
  }
  if (!history.length || history[history.length - 1].role !== "user") {
    return NextResponse.json({ error: "no_user_message" }, { status: 400 });
  }

  const system = systemPrompt(String(body.step || "type").slice(0, 20), body.lead || {});
  let fields: Lead = {};
  const messages = [...history];

  try {
    // At most two rounds: one that may call set_lead_fields, one for the reply text.
    for (let round = 0; round < 2; round++) {
      const response = await client.messages.create({
        model: MODEL,
        max_tokens: 400,
        system,
        tools,
        messages,
      });
      const text = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("")
        .trim();
      const toolUses = response.content.filter((b): b is Anthropic.ToolUseBlock => b.type === "tool_use");
      for (const t of toolUses) fields = { ...fields, ...cleanFields(t.input) };

      if (response.stop_reason !== "tool_use" || !toolUses.length) {
        return NextResponse.json({ reply: text || "Am notat.", fields });
      }
      messages.push({ role: "assistant", content: response.content });
      messages.push({
        role: "user",
        content: toolUses.map((t) => ({ type: "tool_result" as const, tool_use_id: t.id, content: "Salvat." })),
      });
      if (round === 1) return NextResponse.json({ reply: text || "Am notat.", fields });
    }
  } catch (error) {
    if (error instanceof Anthropic.APIError) console.error(`[assistant] API error ${error.status}:`, error.message);
    else console.error("[assistant]", error);
    return NextResponse.json({ reply: FALLBACK, fields });
  }
  return NextResponse.json({ reply: "Am notat.", fields });
}
