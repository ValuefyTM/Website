import { PrivacyView, privacyMetadata } from "@/app/(ro)/politica-de-confidentialitate/view";

export const metadata = privacyMetadata("en");

export default function Page() {
  return <PrivacyView lang="en" />;
}
