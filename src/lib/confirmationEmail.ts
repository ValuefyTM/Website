import { site } from "@/config/site";
import type { LeadRecord } from "./lead";
import { numberLocale, type Lang } from "@/i18n/lang";
import { label } from "@/i18n/labels";

const esc = (s: unknown) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

const STRONG = 'style="color:#17173A"';

const T = {
  ro: {
    requestNo: "Număr solicitare",
    saleWhat: "Proprietate de vândut",
    valuationWhat: "Ce evaluăm",
    city: "Localitate",
    askingPrice: "Preț dorit",
    purpose: "Scopul evaluării",
    deadline: "Termen dorit",
    subject: (id: string) => `Am primit solicitarea ta ${id} — VALUEFY`,
    introSale: `Un consultant VALUEFY analizează informațiile și te contactează în cel mai scurt timp pentru <strong ${STRONG}>evaluarea proprietății și planul de vânzare</strong>.`,
    introValuation: `Un specialist VALUEFY verifică informațiile și revine către tine în cel mai scurt timp cu <strong ${STRONG}>oferta de evaluare</strong>: costul, termenul și lista documentelor necesare.`,
    nextSale: ["Te contactăm pentru detalii și programăm o vizită la proprietate.", "Evaluăm proprietatea și stabilim împreună prețul de listare.", "Pregătim anunțul, fotografiile și documentele, apoi ne ocupăm de vizionări și negociere."],
    nextValuation: ["Primești oferta, cu cost, termen și documente necesare.", "După acceptare, programăm inspecția împreună cu tine.", "Primești raportul de evaluare, semnat de evaluator autorizat ANEVAR."],
    eyebrow: "Solicitare primită",
    thanks: (name: string) => `Mulțumim${name ? ", " + name : ""}! Am primit solicitarea ta.`,
    thanksText: (name: string, id: string) => `Mulțumim${name ? ", " + name : ""}! Am primit solicitarea ta ${id}.`,
    nextTitle: "Ce urmează",
    question: (phoneLink: string, id: string) => `Ai o întrebare între timp? Răspunde la acest email sau sună-ne la ${phoneLink}. Te rugăm să păstrezi numărul solicitării, <strong ${STRONG}>${id}</strong>.`,
    questionText: (phone: string) => `Ai o întrebare? Răspunde la acest email sau sună-ne la ${phone}.`,
    firm: "Firmă autorizată ANEVAR",
    why: (sale: boolean) => `Ai primit acest email pentru că ai trimis o solicitare ${sale ? "de vânzare" : "de evaluare"} pe site-ul nostru.`,
  },
  en: {
    requestNo: "Request number",
    saleWhat: "Property to sell",
    valuationWhat: "What we are valuing",
    city: "Location",
    askingPrice: "Asking price",
    purpose: "Purpose of the valuation",
    deadline: "Preferred deadline",
    subject: (id: string) => `We've received your request ${id} — VALUEFY`,
    introSale: `A VALUEFY consultant is reviewing the information and will contact you as soon as possible about <strong ${STRONG}>the property valuation and the sales plan</strong>.`,
    introValuation: `A VALUEFY specialist is checking the information and will get back to you as soon as possible with <strong ${STRONG}>the valuation offer</strong>: the cost, the timeframe and the list of documents needed.`,
    nextSale: ["We contact you for details and arrange a visit to the property.", "We value the property and agree the listing price together.", "We prepare the listing, the photos and the documents, then handle viewings and negotiation."],
    nextValuation: ["You receive the offer, with the cost, the timeframe and the documents needed.", "Once you accept, we arrange the inspection with you.", "You receive the valuation report, signed by an ANEVAR-authorised valuer."],
    eyebrow: "Request received",
    thanks: (name: string) => `Thank you${name ? ", " + name : ""}! We've received your request.`,
    thanksText: (name: string, id: string) => `Thank you${name ? ", " + name : ""}! We've received your request ${id}.`,
    nextTitle: "What happens next",
    question: (phoneLink: string, id: string) => `Any questions in the meantime? Reply to this email or call us on ${phoneLink}. Please keep your request number, <strong ${STRONG}>${id}</strong>.`,
    questionText: (phone: string) => `Any questions? Reply to this email or call us on ${phone}.`,
    firm: "ANEVAR-authorised firm",
    why: (sale: boolean) => `You are receiving this email because you sent a ${sale ? "sale" : "valuation"} request on our website.`,
  },
};

/** Email sent to the visitor right after they submit a request. */
export function confirmationEmail(r: LeadRecord, baseUrl: string = site.url, lang: Lang = r.lang === "en" ? "en" : "ro") {
  const t = T[lang];
  const loc = numberLocale(lang);
  const siteHome = lang === "en" ? `${site.url}/en` : site.url;
  const firstName = (r.name || "").trim().split(/\s+/)[0] || "";
  const what = [label(r.property_type, lang), r.property_description].filter(Boolean).join(" — ");
  const where = [r.city, r.address].filter(Boolean).join(", ");
  const sale = r.request_type === "SALE";
  const rows: [string, unknown][] = [
    [t.requestNo, r.lead_id],
    [sale ? t.saleWhat : t.valuationWhat, what],
    [t.city, where],
    ...(sale
      ? ([[t.askingPrice, r.asking_price ? `${Number(r.asking_price).toLocaleString(loc)} €` : ""]] as [string, unknown][])
      : ([[t.purpose, label(r.valuation_purpose, lang)]] as [string, unknown][])),
    [t.deadline, r.deadline && /^\d{4}-\d{2}-\d{2}$/.test(String(r.deadline)) ? new Date(String(r.deadline)).toLocaleDateString(loc) : label(r.deadline as string | null, lang)],
  ].filter(([, v]) => v) as [string, unknown][];

  const subject = t.subject(r.lead_id);
  const phoneHref = "tel:" + site.phone.replace(/\s/g, "");
  const intro = sale ? t.introSale : t.introValuation;
  const next = sale ? t.nextSale : t.nextValuation;

  const html = `<!DOCTYPE html><html lang="${lang}"><body style="margin:0;padding:0;background:#F7F3EA">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F3EA;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:16px;overflow:hidden;font-family:Verdana,Geneva,sans-serif;color:#17173A">
  <tr><td style="background:#17173A;padding:22px 28px">
    <img src="${baseUrl}/valuefy-logo.png" alt="VALUEFY" height="24" style="height:24px;display:block;background:#FFFFFF;border-radius:6px;padding:6px 10px">
  </td></tr>
  <tr><td style="padding:28px 28px 8px">
    <p style="margin:0 0 6px;font-size:12px;font-weight:bold;letter-spacing:1px;color:#9A5F00;text-transform:uppercase">${t.eyebrow}</p>
    <h1 style="margin:0 0 14px;font-size:22px;line-height:1.3">${t.thanks(esc(firstName))}</h1>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.65;color:#4A4A66">${intro}</p>
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
    <p style="margin:0 0 8px;font-size:14px;font-weight:bold">${t.nextTitle}</p>
    ${next.map((x, i) => `<p style="margin:0 0 6px;font-size:14px;line-height:1.6;color:#4A4A66">${i + 1}. ${esc(x)}</p>`).join("\n    ")}
  </td></tr>
  <tr><td style="padding:16px 28px 28px">
    <p style="margin:0;font-size:14px;line-height:1.6;color:#4A4A66">${t.question(`<a href="${phoneHref}" style="color:#9A5F00;font-weight:bold;text-decoration:none">${esc(site.phone)}</a>`, esc(r.lead_id))}</p>
  </td></tr>
  <tr><td style="background:#FBF8F2;padding:16px 28px;font-size:12px;line-height:1.6;color:#626771">
    VALUEFY · ${t.firm} · <a href="${siteHome}" style="color:#626771">valuefy.ro</a><br>
    ${t.why(sale)}
  </td></tr>
</table></td></tr></table></body></html>`;

  const text = `${t.thanksText(firstName, r.lead_id)}

${intro.replace(/<[^>]+>/g, "")}

${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}

${t.questionText(site.phone)}
VALUEFY · ${t.firm} · ${siteHome}`;

  return { subject, html, text };
}
