import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RR ALIADOS — Mega Dashboard",
  description: "Centro operativo interno de RR ALIADOS.",
};

export default function OpsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
