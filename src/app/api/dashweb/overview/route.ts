import { NextResponse } from "next/server";
import { getDashWebTasks } from "@/lib/dashweb";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getDashWebTasks();
  const open = result.tasks.filter((task) => task.status !== "DONE" && task.status !== "CANCELLED");
  const blocked = result.tasks.filter((task) => task.status === "BLOCKED");
  return NextResponse.json({
    configured: result.configured,
    error: result.error,
    totals: { all: result.tasks.length, open: open.length, blocked: blocked.length },
    tasks: result.tasks,
  });
}
