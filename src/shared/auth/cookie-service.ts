import { cookies } from "next/headers";

interface SetAccessTokenOptions {
  maxAge?: number;
}

export async function setAccessTokenCookie(
  token: string,
  options?: SetAccessTokenOptions,
) {
  const cookieStore = await cookies();

  cookieStore.set("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: options?.maxAge ?? 60 * 60 * 24 * 7,
  });
}

export async function clearAccessTokenCookie() {
  const cookieStore = await cookies();

  cookieStore.delete("access_token");
}

export async function getAccessTokenCookie() {
  const cookieStore = await cookies();

  return cookieStore.get("access_token")?.value;
}
