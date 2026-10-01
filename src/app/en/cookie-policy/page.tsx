import { CookiesView, cookiesMetadata } from "@/app/(ro)/politica-cookies/view";

export const metadata = cookiesMetadata("en");

export default function Page() {
  return <CookiesView lang="en" />;
}
