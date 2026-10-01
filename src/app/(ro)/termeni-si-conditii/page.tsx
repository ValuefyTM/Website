import { TermsView, termsMetadata } from "./view";

export const metadata = termsMetadata("ro");

export default function Page() {
  return <TermsView lang="ro" />;
}
