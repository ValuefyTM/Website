import { redirect } from "next/navigation";
import { site } from "@/config/site";

// The client and partner portal lives at portal.valuefy.ro; old links (and ?tip=colaborator) still work.
export default async function Page({ searchParams }: { searchParams: Promise<{ tip?: string }> }) {
  const tip = (await searchParams).tip;
  redirect(`${site.portalUrl}${/^(colaborator|partner)$/i.test(tip ?? "") ? "?tip=colaborator" : ""}`);
}
