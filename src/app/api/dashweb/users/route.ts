import { NextResponse } from "next/server";
import { getDashWebUsers } from "@/lib/dashweb";

export const dynamic = "force-dynamic";

export async function GET() {
  const result = await getDashWebUsers();
  return NextResponse.json({
    configured: result.configured,
    error: result.error,
    count: result.users.length,
    users: result.users,
  });
}
