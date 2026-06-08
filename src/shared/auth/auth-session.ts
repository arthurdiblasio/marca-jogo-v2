import { jwtService } from "@/modules/auth/services/jwt-service";

import {
  clearAccessTokenCookie,
  getAccessTokenCookie,
  setAccessTokenCookie,
} from "./cookie-service";

import type { AuthUser } from "./auth-user";

export async function createSession(
  user: AuthUser,
  options?: {
    maxAge?: number;
  },
) {
  const token = await jwtService.sign(user);

  await setAccessTokenCookie(token, {
    maxAge: options?.maxAge,
  });

  return token;
}

export async function destroySession() {
  await clearAccessTokenCookie();
}

export async function getSession() {
  const token = await getAccessTokenCookie();

  if (!token) {
    return null;
  }

  try {
    return await jwtService.verify(token);
  } catch {
    return null;
  }
}
