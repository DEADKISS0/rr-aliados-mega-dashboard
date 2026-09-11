import type { Metadata } from "next";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "RR ALIADOS — Mega Dashboard",
  description: "Centro operativo interno de RR ALIADOS.",
};

export default function OpsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}><Header />{children}</div>;
}
