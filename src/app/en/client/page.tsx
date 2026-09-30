import { ClientLoginView, clientMetadata } from "@/app/(ro)/client/view";

export const metadata = clientMetadata("en");

export default function Page() {
  return <ClientLoginView lang="en" />;
}
