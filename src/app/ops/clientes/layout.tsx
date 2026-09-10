import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RR ALIADOS — Clientes",
  description: "Gestión de clientes y prospectos.",
};

export default function ClientesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
