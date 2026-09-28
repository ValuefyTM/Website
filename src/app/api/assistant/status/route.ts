import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = process.env.ASSISTANT_MODEL || "claude-haiku-4-5";
const TTL_MS = 5 * 60 * 1000;

type Status = { online: boolean; reason: string; detail?: string; checked_at: string };
let cached: { at: number; status: Status } | null = null;

/** Explains, in plain Romanian, why the AI is unavailable. */
function describe(error: unknown): Pick<Status, "reason" | "detail"> {
  const detail = error instanceof Error ? error.message.slice(0, 200) : undefined;
  if (error instanceof Anthropic.AuthenticationError) return { reason: "Cheia ANTHROPIC_API_KEY este invalidă sau a fost ștearsă (401).", detail };
  if (error instanceof Anthropic.PermissionDeniedError) return { reason: "Cheia nu are acces la acest model (403).", detail };
  if (error instanceof Anthropic.NotFoundError) return { reason: `Modelul „${MODEL}” nu a fost găsit — verifică ASSISTANT_MODEL (404).`, detail };
  if (error instanceof Anthropic.RateLimitError) return { reason: "S-a atins limita de utilizare sau de cheltuieli la Anthropic (429).", detail };
  if (error instanceof Anthropic.BadRequestError)
    return { reason: /credit/i.test(detail || "") ? "Nu mai există credit în contul Anthropic (Billing)." : "Cererea a fost respinsă de Anthropic (400).", detail };
  if (error instanceof Anthropic.APIError) return { reason: `Eroare la Anthropic (${error.status ?? "fără cod"}).`, detail };
  return { reason: "Serverul nu a putut contacta Anthropic.", detail };
}

async function check(): Promise<Status> {
  const checked_at = new Date().toISOString();
  if (!process.env.ANTHROPIC_API_KEY) {
    return { online: false, reason: "Variabila ANTHROPIC_API_KEY lipsește din setările Cloudflare.", checked_at };
  }
  try {
    // Smallest possible real request: confirms the key, the model and that the account has credit.
    const client = new Anthropic();
    await client.messages.create(
      { model: MODEL, max_tokens: 1, messages: [{ role: "user", content: "ping" }] },
      { timeout: 8000, maxRetries: 0 },
    );
    return { online: true, reason: "Asistentul AI funcționează.", checked_at };
  } catch (error) {
    console.error("[assistant/status]", error instanceof Anthropic.APIError ? `${error.status} ${error.message}` : error);
    return { online: false, ...describe(error), checked_at };
  }
}

export async function GET(req: Request) {
  const fresh = new URL(req.url).searchParams.has("fresh");
  if (!fresh && cached && Date.now() - cached.at < TTL_MS) return NextResponse.json(cached.status);
  const status = await check();
  cached = { at: Date.now(), status };
  return NextResponse.json(status, { headers: { "Cache-Control": "no-store" } });
}
