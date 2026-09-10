import { NextResponse } from "next/server";
import { deals, salesMetrics, revenueScenarios } from "@/data/salesPipeline";
import { getBusinessContext } from "@/data/businessContext";

export async function GET() {
  const ctx = getBusinessContext();

  return NextResponse.json({
    updatedAt: new Date().toISOString(),
    source: "RR ALIADOS workspace snapshot",
    metrics: salesMetrics,
    deals,
    revenueScenarios,
    context: {
      clientsTargetQ3: ctx.clientsTargetQ3,
      clientsClosed: ctx.clientsClosed,
      wuunderDaysLeft: ctx.wuunderDaysLeft,
      wuunderDeadline: ctx.wuunderDeadline,
      runwayDays: ctx.runwayDays,
      capitalCop: ctx.capitalCop,
    },
  });
}
