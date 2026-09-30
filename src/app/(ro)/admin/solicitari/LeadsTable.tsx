"use client";

import { useMemo, useState } from "react";
import type { AdminLead } from "@/lib/leads-admin";
import { LeadStatusSelect } from "./LeadControls";
import a from "../admin.module.css";

type Props = { leads: AdminLead[]; statuses: readonly (readonly [string, string])[] };

const fmtDate = (d: string) => new Date(d).toLocaleString("ro-RO", { dateStyle: "short", timeStyle: "short" });
const eur = (n: number) => n.toLocaleString("ro-RO") + " €";
const fold = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function LeadsTable({ leads, statuses }: Props) {
  const [kind, setKind] = useState<"all" | "valuation" | "sale">("all");
  const [status, setStatus] = useState("open");
  const [q, setQ] = useState("");

  const shown = useMemo(() => {
    const term = fold(q.trim());
    return leads.filter((l) => {
      if (kind !== "all" && l.kind !== kind) return false;
      if (status === "open" && ["WON", "LOST"].includes(l.status)) return false;
      if (status !== "open" && status !== "all" && l.status !== status) return false;
      if (!term) return true;
      return fold([l.id, l.name, l.email, l.phone, l.city, l.address, l.property_type, l.description].filter(Boolean).join(" ")).includes(term);
    });
  }, [leads, kind, status, q]);

  const count = (k: "valuation" | "sale") => leads.filter((l) => l.kind === k && l.status === "NEW").length;

  return (
    <>
      <div className={a.filterBar}>
        <div className={a.tabs} role="tablist" aria-label="Tip solicitare">
          {([["all", "Toate"], ["valuation", "Evaluare"], ["sale", "Vânzare"]] as const).map(([k, label]) => (
            <button key={k} type="button" role="tab" aria-selected={kind === k} onClick={() => setKind(k)}>
              {label}
              {k !== "all" && count(k) > 0 && <span className={a.badge}>{count(k)}</span>}
            </button>
          ))}
        </div>
        <select className={a.select} value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filtru status">
          <option value="open">Active (fără închise)</option>
          <option value="all">Toate statusurile</option>
          {statuses.map(([k, label]) => <option key={k} value={k}>{label}</option>)}
        </select>
        <input className={a.search} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Caută nume, telefon, localitate, VF-…" aria-label="Caută" />
      </div>

      {shown.length === 0 ? (
        <div className={a.empty}>{leads.length ? "Nicio solicitare pentru filtrele alese." : "Încă nu ai solicitări prin asistent."}</div>
      ) : (
        <div className={a.tableWrap}>
          <table className={a.table}>
            <thead>
              <tr><th>Data</th><th>Solicitare</th><th>Proprietate</th><th>Scop / preț dorit</th><th>Client</th><th>Status</th></tr>
            </thead>
            <tbody>
              {shown.map((l) => (
                <tr key={l.id} className={l.status === "NEW" ? a.isNew : undefined}>
                  <td className={a.nowrap}>{fmtDate(l.created_at)}</td>
                  <td className={a.nowrap}>
                    <a href={`/admin/solicitari/${l.id}`} className={a.rowTitle}>{l.id}</a><br />
                    <span className={`${a.pill} ${l.kind === "sale" ? a.pillSale : a.pillVal}`}>{l.kind === "sale" ? "Vânzare" : "Evaluare"}</span>
                    {l.priority !== "NORMAL" && <span className={`${a.pill} ${l.priority === "URGENT" ? a.pillUrgent : ""}`}>{l.priority === "URGENT" ? "Urgent" : "Prioritar"}</span>}
                  </td>
                  <td>
                    <b>{l.property_type}</b>{l.description ? ` — ${l.description}` : ""}<br />
                    <span className={a.muted}>
                      {[l.city, l.surface_area ? `${l.surface_area} m²` : l.land_area ? `${l.land_area} m² teren` : "", l.rooms ? `${l.rooms} cam.` : ""].filter(Boolean).join(" · ")}
                    </span>
                  </td>
                  <td>{l.kind === "sale" ? (l.asking_price ? eur(l.asking_price) : <span className={a.muted}>—</span>) : l.purpose}</td>
                  <td>
                    {l.name}<br />
                    {l.phone && <a href={`tel:${l.phone.replace(/\s/g, "")}`}>{l.phone}</a>}
                    {l.phone && l.email && " · "}
                    {l.email && <a href={`mailto:${l.email}`}>{l.email}</a>}
                  </td>
                  <td><LeadStatusSelect id={l.id} status={l.status} options={statuses} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
