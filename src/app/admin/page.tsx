import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { listAll, listInquiries } from "@/lib/listings-db";
import { formatEur } from "@/lib/listing-format";
import { AdminShell } from "./AdminShell";
import { PublishToggle, InquiryStatus } from "./AdminControls";
import a from "./admin.module.css";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  if (!(await isAdmin())) redirect("/admin/login");
  const db = await getDb();
  if (!db) return <AdminShell><p className={a.warn}>Baza de date nu este disponibilă.</p></AdminShell>;
  const [listings, inquiries] = await Promise.all([listAll(db), listInquiries(db)]);
  const newCount = inquiries.filter((i) => i.status === "NEW").length;

  return (
    <AdminShell active="listings">
      <div className={a.pageHead}>
        <div>
          <h1>Proprietăți</h1>
          <p>{listings.length} anunțuri · {listings.filter((l) => l.published).length} publicate</p>
        </div>
        <a href="/admin/proprietati/nou" className={a.primary}>+ Adaugă proprietate</a>
      </div>

      {listings.length === 0 ? (
        <div className={a.empty}>Nu ai adăugat încă nicio proprietate. Apasă „Adaugă proprietate” ca să începi.</div>
      ) : (
        <ul className={a.list}>
          {listings.map((l) => (
            <li key={l.id} className={a.row}>
              <a href={`/admin/proprietati/${l.id}`} className={a.thumb}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {l.photos[0] ? <img src={l.photos[0]} alt="" /> : <span>fără foto</span>}
              </a>
              <div className={a.rowMain}>
                <a href={`/admin/proprietati/${l.id}`} className={a.rowTitle}>{l.title}</a>
                <div className={a.rowMeta}>
                  {l.type} · {[l.zone, l.city].filter(Boolean).join(", ")} · <b>{formatEur(l.price)}</b>
                  {l.report && <span className={a.pill}>Raport</span>}
                  {l.status && <span className={a.pill}>{l.status}</span>}
                  <span className={a.muted}>{l.photos.length} foto</span>
                </div>
              </div>
              <PublishToggle id={l.id} published={l.published} />
              <div className={a.rowActions}>
                <a href={`/admin/proprietati/${l.id}`} className={a.ghostBtn}>Editează</a>
                <a href={`/imobiliare/${l.slug}`} target="_blank" rel="noopener" className={a.ghostBtn}>Vezi ↗</a>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div id="cereri" className={a.pageHead} style={{ marginTop: 48 }}>
        <div>
          <h1>Cereri primite</h1>
          <p>{inquiries.length} cereri · {newCount} noi. Rapoartele de evaluare nu se trimit automat — trimite-le pe email după verificare, apoi marchează cererea.</p>
        </div>
      </div>
      {inquiries.length === 0 ? (
        <div className={a.empty}>Încă nu ai cereri de vizionare sau de raport.</div>
      ) : (
        <div className={a.tableWrap}>
          <table className={a.table}>
            <thead>
              <tr><th>Data</th><th>Tip</th><th>Proprietate</th><th>Persoană</th><th>Contact</th><th>Motiv / mesaj</th><th>Status</th></tr>
            </thead>
            <tbody>
              {inquiries.map((q) => (
                <tr key={q.id} className={q.status === "NEW" ? a.isNew : undefined}>
                  <td>{new Date(q.created_at).toLocaleString("ro-RO", { dateStyle: "short", timeStyle: "short" })}</td>
                  <td><span className={a.pill}>{q.kind === "report" ? "Raport" : "Vizionare"}</span></td>
                  <td>{q.listing_title}</td>
                  <td>{q.name}</td>
                  <td>
                    {q.phone && <a href={`tel:${q.phone.replace(/\s/g, "")}`}>{q.phone}</a>}
                    {q.email && <><br /><a href={`mailto:${q.email}`}>{q.email}</a></>}
                  </td>
                  <td className={a.msg}>{[q.reason, q.message].filter(Boolean).join(" — ") || "—"}</td>
                  <td><InquiryStatus id={q.id} status={q.status} kind={q.kind} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
