import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getBySlug } from "@/lib/listings-db";
import { esc, officeEmails, sendEmail } from "@/lib/email";
import { site } from "@/config/site";
import { inLang } from "@/lib/listing-format";
import type { Lang } from "@/i18n/lang";

export const runtime = "nodejs";

// Messages shown to the visitor (form errors) and the confirmation email, in the language of the form.
const T = {
  ro: {
    name: "Te rog completează numele.", phone: "Numărul de telefon pare incomplet.", email: "Adaugă o adresă de email validă.",
    consent: "Este necesar acordul privind datele.", unavailable: "Serviciul nu este disponibil momentan.",
    gone: "Proprietatea nu mai este disponibilă.", noReport: "Proprietatea nu are raport de evaluare.",
    introReport: "Am primit solicitarea ta pentru raportul de evaluare. Verificăm datele și ți-l trimitem pe email în cel mai scurt timp.",
    introViewing: "Am primit cererea ta de vizionare. Un consultant VALUEFY te contactează în cel mai scurt timp pentru programare.",
    subjectReport: "Solicitarea raportului", subjectViewing: "Cererea de vizionare",
    thanks: (n: string) => `Mulțumim, ${n}!`,
    questions: (phone: string) => `Întrebări? Răspunde la acest email sau sună-ne la ${phone}.`,
  },
  en: {
    name: "Please enter your name.", phone: "The phone number looks incomplete.", email: "Please add a valid email address.",
    consent: "Your consent regarding your data is required.", unavailable: "The service is not available at the moment.",
    gone: "This property is no longer available.", noReport: "This property does not have a valuation report.",
    introReport: "We have received your request for the valuation report. We'll check your details and email it to you as soon as possible.",
    introViewing: "We have received your viewing request. A VALUEFY consultant will contact you shortly to arrange it.",
    subjectReport: "Your valuation report request", subjectViewing: "Your viewing request",
    thanks: (n: string) => `Thank you, ${n}!`,
    questions: (phone: string) => `Any questions? Reply to this email or call us on ${phone}.`,
  },
};

// Viewing requests and valuation-report requests from /imobiliare pages.
export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const str = (k: string, max = 300) => (typeof b[k] === "string" ? (b[k] as string).trim().slice(0, max) : "");
  const kind = str("kind") === "report" ? "report" : "viewing";
  const name = str("name", 120), email = str("email", 160).toLowerCase(), phone = str("phone", 40);
  const reason = str("reason", 120), message = str("message", 2000);
  const lang: Lang = str("lang") === "en" ? "en" : "ro";
  const t = T[lang];
  if (b.website) return NextResponse.json({ ok: true }); // honeypot
  if (!name) return NextResponse.json({ error: t.name }, { status: 400 });
  if (phone.replace(/\D/g, "").length < 9) return NextResponse.json({ error: t.phone }, { status: 400 });
  if (kind === "report" && !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: t.email }, { status: 400 });
  if (b.consent !== true) return NextResponse.json({ error: t.consent }, { status: 400 });

  const db = await getDb();
  if (!db) return NextResponse.json({ error: t.unavailable }, { status: 503 });
  const listing = await getBySlug(db, str("slug", 120));
  if (!listing) return NextResponse.json({ error: t.gone }, { status: 404 });
  if (kind === "report" && !listing.report) return NextResponse.json({ error: t.noReport }, { status: 400 });

  const row = await db
    .prepare(
      "INSERT INTO listing_inquiries (listing_id, listing_title, kind, name, email, phone, reason, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id",
    )
    .bind(listing.id, listing.title, kind, name, email || null, phone, reason || null, message || null)
    .first<{ id: number }>();

  const origin = new URL(req.url).origin;
  const what = kind === "report" ? "Cerere raport de evaluare" : "Cerere vizionare";
  const rows: [string, string][] = [["Proprietate", listing.title], ["Nume", name], ["Telefon", phone], ["Email", email || "—"], ...(reason ? ([["Motiv", reason]] as [string, string][]) : []), ...(message ? ([["Mesaj", message]] as [string, string][]) : []), ["Limba", lang === "en" ? "Engleză" : "Română"]];
  const officeSent = await sendEmail({
    to: officeEmails(),
    replyTo: email || undefined,
    subject: `[${what}] ${listing.title}`,
    html: `<div style="font-family:Verdana,sans-serif;color:#17173A"><h2 style="margin:0 0 12px">${esc(what)}</h2>
<table cellpadding="6" style="border-collapse:collapse;font-size:14px">${rows.map(([k, v]) => `<tr><td style="color:#626771">${esc(k)}</td><td style="font-weight:bold">${esc(v)}</td></tr>`).join("")}</table>
<p style="font-size:14px"><a href="${origin}/imobiliare/${listing.slug}">Vezi anunțul</a> · <a href="${origin}/admin">Deschide adminul</a></p>
${kind === "report" ? '<p style="font-size:13px;color:#9A5F00">Raportul nu se trimite automat — trimite-l tu solicitantului după verificare.</p>' : ""}</div>`,
  });
  if (officeSent && row) await db.prepare("UPDATE listing_inquiries SET email_sent = 1 WHERE id = ?").bind(row.id).run();

  if (email) {
    const intro = kind === "report" ? t.introReport : t.introViewing;
    const title = inLang(listing, lang).title;
    await sendEmail({
      to: [email],
      replyTo: officeEmails()[0],
      subject: `${kind === "report" ? t.subjectReport : t.subjectViewing} — ${title}`,
      html: `<div style="font-family:Verdana,sans-serif;color:#17173A;max-width:560px"><h2 style="margin:0 0 12px">${esc(t.thanks(name.split(/\s+/)[0]))}</h2>
<p style="font-size:15px;line-height:1.6;color:#4A4A66">${esc(intro)}</p>
<p style="font-size:14px"><b>${esc(title)}</b><br>${esc(listing.zone)}, ${esc(listing.city)}</p>
<p style="font-size:14px;color:#4A4A66">${esc(t.questions(site.phone))}</p></div>`,
      text: `${intro}\n\n${title}\n${site.phone}`,
    });
  }

  return NextResponse.json({ ok: true });
}
