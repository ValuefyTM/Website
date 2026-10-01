import { notFound } from "next/navigation";

// Any unknown /en/… address shows the English 404 (src/app/en/not-found.tsx).
export default function Missing() {
  notFound();
}
