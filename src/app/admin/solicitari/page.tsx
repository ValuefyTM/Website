import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { LEAD_STATUSES, listLeads } from "@/lib/leads-admin";
import { AdminShell } from "../AdminShell";
import { LeadsTable } from "./LeadsTable";
import a from "../admin.module.css";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const db = await getDb();
  if (!db) return <AdminShell active="leads"><p className={a.warn}>Baza de date nu este disponibilă.</p></AdminShell>;
  const leads = await listLeads(db);
  const fresh = leads.filter((l) => l.status === "NEW").length;

  return (
    <AdminShell active="leads">
      <div className={a.pageHead}>
        <div>
          <h1>Solicitări</h1>
          <p>
            {leads.length} solicitări prin asistent · {fresh} noi. Evaluările și proprietățile propuse spre vânzare ajung aici și pe email;
            documentele încărcate de client sunt atașate în email.
          </p>
        </div>
      </div>
      <LeadsTable leads={leads} statuses={LEAD_STATUSES} />
    </AdminShell>
  );
}
