import { HomeView, homeMetadata } from "@/app/(ro)/home-view";

export const dynamic = "force-dynamic";
export const metadata = homeMetadata("en");

export default function Page() {
  return <HomeView lang="en" />;
}
