import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RR ALIADOS — Ops Dashboard",
  description: "Centro de comando interno de RR ALIADOS.",
};

export default function OpsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
