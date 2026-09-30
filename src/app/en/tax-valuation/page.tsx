import { TaxValuationView, taxMetadata } from "@/app/(ro)/evaluare-pentru-impozitare/view";

export const metadata = taxMetadata("en");

export default function Page() {
  return <TaxValuationView lang="en" />;
}
