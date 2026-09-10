import { NextResponse } from "next/server";
import { getDashWebProjects } from "@/lib/dashweb";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const includeDemo = searchParams.get("includeDemo") === "1";
  const result = await getDashWebProjects({ includeDemo });
  return NextResponse.json({
    configured: result.configured,
    error: result.error,
    count: result.projects.length,
    projects: result.projects,
    demoExcludedByDefault: !includeDemo,
  });
}
