import { TaxValuationView, taxMetadata } from "./view";

export const metadata = taxMetadata("ro");

export default function Page() {
  return <TaxValuationView lang="ro" />;
}
