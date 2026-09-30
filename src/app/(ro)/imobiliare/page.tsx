import { ListingsView, listingsMetadata } from "./listings-view";

export const metadata = listingsMetadata("ro");

// Listings come from the database, so render on every request.
export const dynamic = "force-dynamic";

export default function ListingsPage() {
  return <ListingsView lang="ro" />;
}
