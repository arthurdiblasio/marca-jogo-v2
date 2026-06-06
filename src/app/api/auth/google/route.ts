import { OAuth2Client } from "google-auth-library";

import { cookies } from "next/headers";

import { NextResponse } from "next/server";

import { loginWithGoogle } from "@/modules/auth/actions/login-with-google";

import { jwtService } from "@/modules/auth/services/jwt-service";

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

export async function POST(request: Request) {
  const body = await request.json();

  const { code } = body;
  const { sub, email, name } = await getPayloadGoogleLogin();
  const user = await loginWithGoogle({
    sub,
    email: email!,
    name: name!,
  });
  const token = await jwtService.sign({
    id: user.id,
    email: user.email,
  });
  const cookieStore = await cookies();

  cookieStore.set("access_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",

    sameSite: "lax",

    path: "/",

    maxAge: 60 * 60 * 24 * 7,
  });
  return NextResponse.json({
    success: true,
  });

  async function getPayloadGoogleLogin() {
    const { tokens } = await googleClient.getToken({
      code,
      redirect_uri: "http://localhost:3000",
    });
    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token!,
    });
    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error("Google payload not found");
    }
    return payload;
  }
}
