import { MovableAssetsView, movableMetadata } from "@/app/(ro)/evaluare-bunuri-mobile/view";

export const metadata = movableMetadata("en");

export default function Page() {
  return <MovableAssetsView lang="en" />;
}
