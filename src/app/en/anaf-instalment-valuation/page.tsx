import { AnafValuationView, anafMetadata } from "@/app/(ro)/evaluare-esalonare-anaf/view";

export const metadata = anafMetadata("en");

export default function Page() {
  return <AnafValuationView lang="en" />;
}
