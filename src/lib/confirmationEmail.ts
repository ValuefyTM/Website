import { site } from "@/config/site";
import type { LeadRecord } from "./lead";

const esc = (s: unknown) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** Email sent to the visitor right after they submit a request. */
export function confirmationEmail(r: LeadRecord, baseUrl: string = site.url) {
  const firstName = (r.name || "").trim().split(/\s+/)[0] || "";
  const what = [r.property_type, r.property_description].filter(Boolean).join(" — ");
  const where = [r.city, r.address].filter(Boolean).join(", ");
  const rows: [string, unknown][] = [
    ["Număr solicitare", r.lead_id],
    ["Ce evaluăm", what],
    ["Localitate", where],
    ["Scopul evaluării", r.valuation_purpose],
    ["Termen dorit", r.deadline && /^\d{4}-\d{2}-\d{2}$/.test(String(r.deadline)) ? new Date(String(r.deadline)).toLocaleDateString("ro-RO") : r.deadline],
  ].filter(([, v]) => v) as [string, unknown][];

  const subject = `Am primit solicitarea ta ${r.lead_id} — VALUEFY`;
  const phoneHref = "tel:" + site.phone.replace(/\s/g, "");

  const html = `<!DOCTYPE html><html lang="ro"><body style="margin:0;padding:0;background:#F7F3EA">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F3EA;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:16px;overflow:hidden;font-family:Verdana,Geneva,sans-serif;color:#17173A">
  <tr><td style="background:#17173A;padding:22px 28px">
    <img src="${baseUrl}/valuefy-logo.png" alt="VALUEFY" height="24" style="height:24px;display:block;background:#FFFFFF;border-radius:6px;padding:6px 10px">
  </td></tr>
  <tr><td style="padding:28px 28px 8px">
    <p style="margin:0 0 6px;font-size:12px;font-weight:bold;letter-spacing:1px;color:#9A5F00;text-transform:uppercase">Solicitare primită</p>
    <h1 style="margin:0 0 14px;font-size:22px;line-height:1.3">Mulțumim${firstName ? ", " + esc(firstName) : ""}! Am primit solicitarea ta.</h1>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#4A4A66">Un specialist VALUEFY verifică informațiile și revine către tine în cel mai scurt timp cu <strong style="color:#17173A">oferta de evaluare</strong>: costul, termenul și lista documentelor necesare.</p>
  </td></tr>
  <tr><td style="padding:8px 28px 4px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FBF8F2;border:1px solid #EDE6D8;border-radius:12px">
      ${rows
        .map(
          ([k, v], i) => `<tr><td style="padding:10px 16px;${i ? "border-top:1px solid #EDE6D8;" : ""}font-size:12px;color:#626771;width:42%">${esc(k)}</td><td style="padding:10px 16px;${i ? "border-top:1px solid #EDE6D8;" : ""}font-size:14px;font-weight:bold">${esc(v)}</td></tr>`,
        )
        .join("")}
    </table>
  </td></tr>
  <tr><td style="padding:20px 28px 8px">
    <p style="margin:0 0 8px;font-size:14px;font-weight:bold">Ce urmează</p>
    <p style="margin:0 0 6px;font-size:14px;line-height:1.6;color:#4A4A66">1. Primești oferta, cu cost, termen și documente necesare.</p>
    <p style="margin:0 0 6px;font-size:14px;line-height:1.6;color:#4A4A66">2. După acceptare, programăm inspecția împreună cu tine.</p>
    <p style="margin:0 0 6px;font-size:14px;line-height:1.6;color:#4A4A66">3. Primești raportul de evaluare, semnat de evaluator autorizat ANEVAR.</p>
  </td></tr>
  <tr><td style="padding:16px 28px 28px">
    <p style="margin:0;font-size:14px;line-height:1.6;color:#4A4A66">Ai o întrebare între timp? Răspunde la acest email sau sună-ne la <a href="${phoneHref}" style="color:#9A5F00;font-weight:bold;text-decoration:none">${esc(site.phone)}</a>. Te rugăm să păstrezi numărul solicitării, <strong style="color:#17173A">${esc(r.lead_id)}</strong>.</p>
  </td></tr>
  <tr><td style="background:#FBF8F2;padding:16px 28px;font-size:12px;line-height:1.6;color:#626771">
    VALUEFY · Firmă autorizată ANEVAR · <a href="${site.url}" style="color:#626771">valuefy.ro</a><br>
    Ai primit acest email pentru că ai trimis o solicitare de evaluare pe site-ul nostru.
  </td></tr>
</table></td></tr></table></body></html>`;

  const text = `Mulțumim${firstName ? ", " + firstName : ""}! Am primit solicitarea ta ${r.lead_id}.

Un specialist VALUEFY verifică informațiile și revine către tine în cel mai scurt timp cu oferta de evaluare: costul, termenul și lista documentelor necesare.

${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}

Ai o întrebare? Răspunde la acest email sau sună-ne la ${site.phone}.
VALUEFY · Firmă autorizată ANEVAR · ${site.url}`;

  return { subject, html, text };
}
