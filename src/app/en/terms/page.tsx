import { TermsView, termsMetadata } from "@/app/(ro)/termeni-si-conditii/view";

export const metadata = termsMetadata("en");

export default function Page() {
  return <TermsView lang="en" />;
}
