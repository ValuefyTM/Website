import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getBySlug } from "@/lib/listings-db";
import { esc, officeEmails, sendEmail } from "@/lib/email";
import { site } from "@/config/site";

export const runtime = "nodejs";

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
  if (b.website) return NextResponse.json({ ok: true }); // honeypot
  if (!name) return NextResponse.json({ error: "Te rog completează numele." }, { status: 400 });
  if (phone.replace(/\D/g, "").length < 9) return NextResponse.json({ error: "Numărul de telefon pare incomplet." }, { status: 400 });
  if (kind === "report" && !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "Adaugă o adresă de email validă." }, { status: 400 });
  if (b.consent !== true) return NextResponse.json({ error: "Este necesar acordul privind datele." }, { status: 400 });

  const db = await getDb();
  if (!db) return NextResponse.json({ error: "Serviciul nu este disponibil momentan." }, { status: 503 });
  const listing = await getBySlug(db, str("slug", 120));
  if (!listing) return NextResponse.json({ error: "Proprietatea nu mai este disponibilă." }, { status: 404 });
  if (kind === "report" && !listing.report) return NextResponse.json({ error: "Proprietatea nu are raport de evaluare." }, { status: 400 });

  const row = await db
    .prepare(
      "INSERT INTO listing_inquiries (listing_id, listing_title, kind, name, email, phone, reason, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id",
    )
    .bind(listing.id, listing.title, kind, name, email || null, phone, reason || null, message || null)
    .first<{ id: number }>();

  const origin = new URL(req.url).origin;
  const what = kind === "report" ? "Cerere raport de evaluare" : "Cerere vizionare";
  const rows: [string, string][] = [["Proprietate", listing.title], ["Nume", name], ["Telefon", phone], ["Email", email || "—"], ...(reason ? ([["Motiv", reason]] as [string, string][]) : []), ...(message ? ([["Mesaj", message]] as [string, string][]) : [])];
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
    const intro = kind === "report"
      ? "Am primit solicitarea ta pentru raportul de evaluare. Verificăm datele și ți-l trimitem pe email în cel mai scurt timp."
      : "Am primit cererea ta de vizionare. Un consultant VALUEFY te contactează în cel mai scurt timp pentru programare.";
    await sendEmail({
      to: [email],
      replyTo: officeEmails()[0],
      subject: `${kind === "report" ? "Solicitarea raportului" : "Cererea de vizionare"} — ${listing.title}`,
      html: `<div style="font-family:Verdana,sans-serif;color:#17173A;max-width:560px"><h2 style="margin:0 0 12px">Mulțumim, ${esc(name.split(/\s+/)[0])}!</h2>
<p style="font-size:15px;line-height:1.6;color:#4A4A66">${esc(intro)}</p>
<p style="font-size:14px"><b>${esc(listing.title)}</b><br>${esc(listing.zone)}, ${esc(listing.city)}</p>
<p style="font-size:14px;color:#4A4A66">Întrebări? Răspunde la acest email sau sună-ne la ${esc(site.phone)}.</p></div>`,
      text: `${intro}\n\n${listing.title}\n${site.phone}`,
    });
  }

  return NextResponse.json({ ok: true });
}
