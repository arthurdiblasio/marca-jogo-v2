import { jwtVerify, SignJWT } from "jose";

import type { AuthUser } from "../types/auth-user";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export const jwtService = {
  async sign(user: AuthUser) {
    return new SignJWT({
      sub: user.id,
      email: user.email,
    })
      .setProtectedHeader({
        alg: "HS256",
      })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);
  },

  async verify(token: string) {
    const { payload } = await jwtVerify(token, secret);

    return {
      id: payload.sub as string,
      email: payload.email as string,
    };
  },
};
