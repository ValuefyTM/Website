import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin-auth";
import { getDb } from "@/lib/db";
import { getById } from "@/lib/listings-db";
import { AdminShell } from "../../AdminShell";
import { ListingEditor } from "../ListingEditor";

export const dynamic = "force-dynamic";

export default async function EditListing({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const db = await getDb();
  const listing = db ? await getById(db, (await params).id) : null;
  if (!listing) notFound();
  return (
    <AdminShell active="listings">
      <ListingEditor listing={listing} />
    </AdminShell>
  );
}
