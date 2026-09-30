import type { Metadata } from "next";
import { ListingView, listingMetadata } from "@/app/(ro)/imobiliare/[slug]/listing-view";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return listingMetadata((await params).slug, "en");
}

export default async function ListingPage({ params }: Props) {
  return <ListingView slug={(await params).slug} lang="en" />;
}
