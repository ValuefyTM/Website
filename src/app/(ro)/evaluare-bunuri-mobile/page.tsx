import { MovableAssetsView, movableMetadata } from "./view";

export const metadata = movableMetadata("ro");

export default function Page() {
  return <MovableAssetsView lang="ro" />;
}
