import type { Metadata } from "next";
import { ReportView, reportMetadata } from "@/app/(ro)/imobiliare/[slug]/raport/report-view";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return reportMetadata((await params).slug, "en");
}

export default async function ReportRequestPage({ params }: Props) {
  return <ReportView slug={(await params).slug} lang="en" />;
}
