import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { AdminShell } from "../../AdminShell";
import { ListingEditor } from "../ListingEditor";

export const dynamic = "force-dynamic";

export default async function NewListing() {
  if (!(await isAdmin())) redirect("/admin/login");
  return (
    <AdminShell active="listings">
      <ListingEditor />
    </AdminShell>
  );
}
