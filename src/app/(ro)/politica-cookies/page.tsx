import { CookiesView, cookiesMetadata } from "./view";

export const metadata = cookiesMetadata("ro");

export default function Page() {
  return <CookiesView lang="ro" />;
}
