import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { buildRecord, fallbackSummary, type Lead, type LeadRecord } from "@/lib/lead";
import { getDb, markLeadEmailed, saveLead } from "@/lib/db";

export const runtime = "nodejs";

const client = new Anthropic();
const MODEL = process.env.ASSISTANT_MODEL || "claude-haiku-4-5";
const MAX_FILES_BYTES = 4 * 1024 * 1024; // keeps the request under typical serverless body limits
const ALLOWED_EXT = /\.(pdf|jpe?g|png|docx?)$/i;

function leadId() {
  const yy = new Date().getFullYear().toString().slice(2);
  const rand = Array.from(crypto.getRandomValues(new Uint8Array(4)), (b) => "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"[b % 32]).join("");
  return `VF-${yy}${rand}`;
}

async function aiSummary(l: Lead): Promise<string | null> {
  try {
    const response = await client.messages.create(
      {
        model: MODEL,
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: `Scrie un rezumat intern de o singură propoziție, în română, pentru dashboard-ul VALUEFY, despre această solicitare de evaluare. Stil: "Client solicită evaluarea unui apartament de 72 m² din Timișoara pentru garantarea unui credit. Documentele sunt disponibile. Termen standard." Fără markdown. Date: ${JSON.stringify(l)}`,
          },
        ],
      },
      { timeout: 6000, maxRetries: 0 },
    );
    const text = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();
    return text || null;
  } catch (error) {
    console.error("[leads] summary failed", error instanceof Anthropic.APIError ? error.status : error);
    return null;
  }
}

const esc = (s: unknown) => String(s ?? "—").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

function emailHtml(r: LeadRecord) {
  const rows: [string, unknown][] = [
    ["Prioritate", r.priority],
    ["Tip proprietate", r.property_type],
    ["Localitate", r.city],
    ["Adresă", r.address],
    ["Suprafață (m²)", r.surface_area],
    ["Teren (m²)", r.land_area],
    ["Camere", r.rooms],
    ["Scop", r.valuation_purpose],
    ["Termen", r.deadline],
    ["Documente", r.documents_status],
    ["Client", r.customer_type],
    ["Nume", r.name],
    ["Telefon", r.phone],
    ["Email", r.email],
    ["Alte detalii", r.notes],
    ["Fișiere", r.documents.join(", ") || "—"],
  ];
  return `<div style="font-family:Verdana,sans-serif;color:#17173A">
<h2 style="margin:0 0 4px">Solicitare nouă ${esc(r.lead_id)}</h2>
<p style="margin:0 0 16px;color:#626771">${esc(r.conversation_summary)}</p>
<table cellpadding="6" style="border-collapse:collapse;font-size:14px">${rows
    .map(([k, v]) => `<tr><td style="color:#626771;border-bottom:1px solid #E7E9ED">${esc(k)}</td><td style="font-weight:bold;border-bottom:1px solid #E7E9ED">${esc(v ?? "—")}</td></tr>`)
    .join("")}</table>
<h3 style="margin:24px 0 8px;font-size:13px;color:#626771">CRM payload</h3>
<pre style="background:#F7F8FA;padding:12px;border-radius:8px;font-size:12px;white-space:pre-wrap">${esc(JSON.stringify(r, null, 2))}</pre>
</div>`;
}

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  let lead: Lead;
  try {
    lead = JSON.parse(String(form.get("lead") || "{}"));
  } catch {
    return NextResponse.json({ error: "invalid_lead" }, { status: 400 });
  }
  if (form.get("consent") !== "true") return NextResponse.json({ error: "consent_required" }, { status: 400 });
  if (!lead.name || !(lead.phone || lead.email) || !lead.property_type) {
    return NextResponse.json({ error: "missing_fields" }, { status: 400 });
  }
  // Honeypot field — bots fill it, humans never see it.
  if (form.get("website")) return NextResponse.json({ ok: true, lead_id: leadId() });

  const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0 && ALLOWED_EXT.test(f.name));
  const total = files.reduce((n, f) => n + f.size, 0);
  const attachFiles = total <= MAX_FILES_BYTES;

  const id = leadId();
  const summary = (await aiSummary(lead)) || fallbackSummary(lead);
  const record = buildRecord(lead, { id, summary, documents: files.map((f) => f.name) });

  // 1. Save to the database (the future CRM reads from here).
  const db = await getDb();
  let saved = false;
  if (db) {
    try {
      await saveLead(db, record, files.map((f) => ({ name: f.name, size: f.size, type: f.type })));
      saved = true;
    } catch (error) {
      console.error("[leads] database save failed", error, JSON.stringify(record));
    }
  }

  // 2. Notify by email.
  const emailed = await sendLeadEmail(record, files, attachFiles);
  if (emailed && saved && db) {
    await markLeadEmailed(db, id).catch((error) => console.error("[leads] could not mark lead as emailed", error));
  }

  // The request is safe as long as it reached at least one of the two.
  if (saved || emailed) return NextResponse.json({ ok: true, lead_id: id });
  if (process.env.NODE_ENV !== "production") {
    console.warn("[leads] no database or email available — lead only logged:", JSON.stringify(record));
    return NextResponse.json({ ok: true, lead_id: id });
  }
  return NextResponse.json({ error: "lead_not_stored" }, { status: 503 });
}

async function sendLeadEmail(record: LeadRecord, files: File[], attachFiles: boolean): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_EMAIL_FROM;
  const to = process.env.LEAD_EMAIL_TO || process.env.NEXT_PUBLIC_EMAIL || "contact@valuefy.ro";
  if (!apiKey || !from) {
    console.warn("[leads] RESEND_API_KEY / LEAD_EMAIL_FROM not set — email skipped");
    return false;
  }

  const attachments = attachFiles
    ? await Promise.all(files.map(async (f) => ({ filename: f.name, content: Buffer.from(await f.arrayBuffer()).toString("base64") })))
    : [];
  const subject = `[${record.priority}] ${record.lead_id} · ${record.property_type}${record.city ? " · " + record.city : ""}`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: to.split(",").map((s) => s.trim()),
        reply_to: record.email || undefined,
        subject,
        html: emailHtml(record) + (files.length && !attachFiles ? `<p style="color:#C2362B">Fișierele depășesc ${MAX_FILES_BYTES / 1048576} MB și nu au fost atașate — cere-le clientului.</p>` : ""),
        attachments,
      }),
    });
    if (!res.ok) {
      console.error("[leads] email failed", res.status, await res.text());
      return false;
    }
    return true;
  } catch (error) {
    console.error("[leads] email failed", error);
    return false;
  }
}
