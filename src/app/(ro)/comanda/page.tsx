import { OrderView, orderMetadata } from "./view";

export const metadata = orderMetadata("ro");

export default async function Page({ searchParams }: { searchParams: Promise<{ tip?: string; scop?: string }> }) {
  const q = await searchParams;
  return <OrderView lang="ro" tip={q.tip} scop={q.scop} />;
}
