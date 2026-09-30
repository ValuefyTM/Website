import { ListingsView, listingsMetadata } from "@/app/(ro)/imobiliare/listings-view";

export const metadata = listingsMetadata("en");

// Listings come from the database, so render on every request.
export const dynamic = "force-dynamic";

export default function ListingsPage() {
  return <ListingsView lang="en" />;
}
