import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { LEAD_STATUSES, getLead } from "@/lib/leads-admin";
import { AdminShell } from "../../AdminShell";
import { LeadNotes, LeadStatusSelect } from "../LeadControls";
import a from "../../admin.module.css";

export const dynamic = "force-dynamic";

const deadline = (d: string | null) => (d && /^\d{4}-\d{2}-\d{2}$/.test(d) ? new Date(d).toLocaleDateString("ro-RO") : d);

export default async function LeadPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const db = await getDb();
  if (!db) notFound();
  const l = await getLead(db, (await params).id);
  if (!l) notFound();
  const sale = l.kind === "sale";

  const property: [string, React.ReactNode][] = [
    ["Tip", l.property_type],
    ...(l.description ? ([["Descriere", l.description]] as [string, string][]) : []),
    ["Localitate", l.city],
    ["Adresă", l.address],
    ["Suprafață utilă", l.surface_area ? `${l.surface_area} m²` : null],
    ["Teren", l.land_area ? `${l.land_area} m²` : null],
    ["Camere", l.rooms],
    ["Alte detalii", l.notes],
  ];
  const request: [string, React.ReactNode][] = sale
    ? [["Preț dorit", l.asking_price ? `${l.asking_price.toLocaleString("ro-RO")} €` : "De stabilit"], ["Documente", l.documents_status]]
    : [["Scop", l.purpose], ["Termen", deadline(l.deadline)], ["Documente", l.documents_status]];

  const rows = (items: [string, React.ReactNode][]) => (
    <dl className={a.dl}>
      {items.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v || "—"}</dd></div>)}
    </dl>
  );

  return (
    <AdminShell active="leads">
      <div className={a.pageHead}>
        <div>
          <a href="/admin/solicitari" className={a.back}>← Solicitări</a>
          <h1>
            {l.id}{" "}
            <span className={`${a.pill} ${sale ? a.pillSale : a.pillVal}`}>{sale ? "Vânzare" : "Evaluare"}</span>
            {l.priority !== "NORMAL" && <span className={`${a.pill} ${l.priority === "URGENT" ? a.pillUrgent : ""}`}>{l.priority === "URGENT" ? "Urgent" : "Prioritar"}</span>}
          </h1>
          <p>Primită {new Date(l.created_at).toLocaleString("ro-RO", { dateStyle: "long", timeStyle: "short" })} · {l.email_sent ? "notificare trimisă pe email" : "emailul de notificare nu a plecat"}</p>
        </div>
        <LeadStatusSelect id={l.id} status={l.status} options={LEAD_STATUSES} />
      </div>

      {l.summary && <div className={a.summaryNote}>{l.summary}</div>}

      <div className={a.detailGrid}>
        <section className={a.panel}>
          <h2>Client</h2>
          {rows([
            ["Nume", l.name],
            ["Tip client", l.customer_type],
            ["Telefon", l.phone && <a href={`tel:${l.phone.replace(/\s/g, "")}`}>{l.phone}</a>],
            ["Email", l.email && <a href={`mailto:${l.email}?subject=${encodeURIComponent(`Solicitarea ${l.id} — VALUEFY`)}`}>{l.email}</a>],
          ])}
          <div className={a.contactBtns}>
            {l.phone && <a className={a.primary} href={`tel:${l.phone.replace(/\s/g, "")}`}>Sună</a>}
            {l.phone && <a className={a.ghostBtn} href={`https://wa.me/${l.phone.replace(/\D/g, "").replace(/^0/, "40")}`} target="_blank" rel="noopener">WhatsApp</a>}
            {l.email && <a className={a.ghostBtn} href={`mailto:${l.email}?subject=${encodeURIComponent(`Solicitarea ${l.id} — VALUEFY`)}`}>Email</a>}
          </div>
        </section>

        <section className={a.panel}>
          <h2>{sale ? "Proprietatea de vândut" : "Ce se evaluează"}</h2>
          {rows(property)}
        </section>

        <section className={a.panel}>
          <h2>{sale ? "Vânzare" : "Evaluare"}</h2>
          {rows(request)}
          <h3 className={a.subhead}>Documente încărcate</h3>
          {l.files.length ? (
            <ul className={a.files}>{l.files.map((f) => <li key={f}>{f}</li>)}</ul>
          ) : <p className={a.hint}>Niciun document încărcat.</p>}
          {l.files.length > 0 && <p className={a.hint}>Fișierele sunt atașate în emailul de notificare.</p>}
        </section>

        <section className={a.panel}>
          <h2>Notițe interne</h2>
          <p className={a.hint}>Vizibile doar în admin.</p>
          <LeadNotes id={l.id} notes={l.admin_notes ?? ""} />
        </section>
      </div>
    </AdminShell>
  );
}
