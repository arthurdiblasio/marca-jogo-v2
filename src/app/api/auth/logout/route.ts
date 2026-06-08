import { destroySession } from "@/shared/auth/auth-session";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();

  await destroySession();

  return NextResponse.json({
    success: true,
  });
}
