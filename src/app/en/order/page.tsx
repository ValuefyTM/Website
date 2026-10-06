import { OrderView, orderMetadata } from "@/app/(ro)/comanda/view";

export const metadata = orderMetadata("en");

export default async function Page({ searchParams }: { searchParams: Promise<{ tip?: string; scop?: string }> }) {
  const q = await searchParams;
  return <OrderView lang="en" tip={q.tip} scop={q.scop} />;
}
