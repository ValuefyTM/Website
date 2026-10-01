import { PrivacyView, privacyMetadata } from "./view";

export const metadata = privacyMetadata("ro");

export default function Page() {
  return <PrivacyView lang="ro" />;
}
