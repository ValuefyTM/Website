import { ClientLoginView, clientMetadata } from "./view";

export const metadata = clientMetadata("ro");

export default function Page() {
  return <ClientLoginView lang="ro" />;
}
