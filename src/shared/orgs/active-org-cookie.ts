import { cookies } from "next/headers";

export async function getActiveOrgId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("active_org")?.value ?? null;
}

export async function setActiveOrgIdCookie(orgId: string) {
  const cookieStore = await cookies();
  cookieStore.set("active_org", orgId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
}
