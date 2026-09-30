import { HomeView, homeMetadata } from "./home-view";

// The property carousel reads the database, so the page renders per request.
export const dynamic = "force-dynamic";
export const metadata = homeMetadata("ro");

export default function Page() {
  return <HomeView lang="ro" />;
}
