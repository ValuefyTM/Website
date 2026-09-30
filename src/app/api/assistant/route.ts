import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { LEAD_ENUMS, LEAD_TEXT_FIELDS, MOBILE, isSale, type Lead } from "@/lib/lead";

export const runtime = "nodejs";

const client = new Anthropic();
const MODEL = process.env.ASSISTANT_MODEL || "claude-haiku-4-5";
const MAX_TURNS = 40;
const MAX_CHARS = 2000;

const FALLBACK = {
  ro: "Momentan nu pot răspunde. Poți continua solicitarea folosind opțiunile de mai jos.",
  en: "I can't reply right now. You can continue your request using the options below.",
};
const NOTED = { ro: "Am notat.", en: "Noted." };

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

const SALE_NOTE = `
MOD VÂNZARE: vizitatorul vrea să VÂNDĂ o proprietate imobiliară prin VALUEFY (VALUEFY o evaluează, o prezintă și găsește cumpărătorul). Nu întreba și nu completa scopul evaluării sau termenul raportului. Colectează doar date despre proprietate, documente și contact. Dacă spune un preț dorit, pune-l în asking_price (doar număr, în euro). Nu estima prețul și nu promite un termen de vânzare; nu face afirmații despre comisionul vânzătorului — le discută consultantul.`;

const EN_NOTE = `
LIMBA: vizitatorul folosește versiunea în engleză a site-ului și scrie în engleză. Răspunde DOAR în engleză (British English), cald și profesionist, în maxim 2 propoziții scurte. Pentru set_lead_fields folosește în continuare exact valorile enum în română (ex. "Apartament", "Credit bancar", "Persoană fizică"), chiar dacă vizitatorul scrie în engleză.`;

function systemPrompt(step: string, lead: Lead, lang: "ro" | "en" = "ro") {
  return `${isSale(lead) ? SALE_NOTE + "\n" : ""}Ești asistentul de evaluare VALUEFY — firmă de evaluare autorizată ANEVAR — evaluează proprietăți imobiliare (apartamente, case, terenuri, spații comerciale, hale) și bunuri mobile (utilaje, echipamente, autovehicule, mijloace fixe) — cu birouri în Timișoara (sediu central) și Cluj-Napoca și o rețea de evaluatori colaboratori autorizați ANEVAR, deci evaluează oriunde în România. Funcționezi ca un formular conversațional ghidat.
Pasul curent în interfață: ${step}. Date colectate: ${JSON.stringify(lead)}.
Dacă utilizatorul oferă informații, apelează set_lead_fields cu valori normalizate (pentru câmpurile enum folosește exact una dintre opțiuni; suprafețele doar ca număr; deadline: "Standard", "Urgent" sau o dată). Pentru utilaje, echipamente, autovehicule sau alte bunuri mobile folosește property_type "Bunuri mobile"; pentru "Bunuri mobile" și "Altă proprietate" pune în property_description o descriere scurtă a ce vrea să evalueze.
Apoi răspunde în română, cald și profesionist, în maxim 2 propoziții scurte. NU pune următoarea întrebare — interfața o afișează automat. Nu oferi prețuri, valori estimate sau termene exacte: costul și termenul sunt comunicate în ofertă, pentru că depind de tipul proprietății, scop, localizare și complexitate. Nu afirma că ai verificat autenticitatea documentelor. Fără markdown.${lang === "en" ? "\n" + EN_NOTE : ""}`;
}

// Normalise what the model extracted: keep non-empty strings, respect enums.
function cleanFields(input: unknown, sale = false): Lead {
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
  if (out.asking_price) out.asking_price = String(out.asking_price).replace(/[^\d]/g, "");
  if (sale) {
    delete out.valuation_purpose;
    delete out.deadline;
    if (out.property_type === MOBILE) delete out.property_type;
  } else delete out.asking_price;
  return out as Lead;
}

export async function POST(req: Request) {
  let body: { messages?: InMsg[]; step?: string; lead?: Lead; lang?: string };
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

  const lang = body.lang === "en" || body.lead?.lang === "en" ? "en" : "ro";
  const system = systemPrompt(String(body.step || "type").slice(0, 20), body.lead || {}, lang);
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
      for (const t of toolUses) fields = { ...fields, ...cleanFields(t.input, isSale(body.lead || {})) };

      if (response.stop_reason !== "tool_use" || !toolUses.length) {
        return NextResponse.json({ reply: text || NOTED[lang], fields });
      }
      messages.push({ role: "assistant", content: response.content });
      messages.push({
        role: "user",
        content: toolUses.map((t) => ({ type: "tool_result" as const, tool_use_id: t.id, content: "Salvat." })),
      });
      if (round === 1) return NextResponse.json({ reply: text || NOTED[lang], fields });
    }
  } catch (error) {
    if (error instanceof Anthropic.APIError) console.error(`[assistant] API error ${error.status}:`, error.message);
    else console.error("[assistant]", error);
    return NextResponse.json({ reply: FALLBACK[lang], fields, ai: false });
  }
  return NextResponse.json({ reply: NOTED[lang], fields });
}
