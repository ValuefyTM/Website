import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | VALUEFY",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div style={{ minHeight: "100vh", background: "#F7F8FA" }}>{children}</div>;
}
