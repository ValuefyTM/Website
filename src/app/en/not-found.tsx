import type { Metadata } from "next";
import { NotFoundView } from "@/components/NotFound";

export const metadata: Metadata = { title: "Page not found | VALUEFY", robots: { index: false } };

export default function NotFound() {
  return <NotFoundView lang="en" />;
}
