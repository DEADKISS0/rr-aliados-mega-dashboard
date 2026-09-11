import type { Metadata } from "next";
import Dashboard from "@/components/finance/Dashboard";

export const metadata: Metadata = {
  title: "RR ALIADOS — Finanzas | Mega Dashboard",
  description: "Centro operativo financiero de RR ALIADOS.",
};

export default function FinanzasPage() {
  return <Dashboard />;
}
