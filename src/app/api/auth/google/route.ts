import { OAuth2Client } from "google-auth-library";

import { cookies } from "next/headers";

import { NextResponse } from "next/server";

import { loginWithGoogle } from "@/modules/auth/actions/login-with-google";

import { createSession } from "@/shared/auth/auth-session";

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
);

export async function POST(request: Request) {
  const body = await request.json();

  const { code, redirectUri } = body;
  const { sub, email, name } = await getPayloadGoogleLogin();
  const user = await loginWithGoogle({
    sub,
    email: email!,
    name: name!,
  });
  await createSession({
    id: user.id,
    email: user.email,
  });

  return NextResponse.json({
    success: true,
  });

  async function getPayloadGoogleLogin() {
    const { tokens } = await googleClient.getToken({
      code,
      redirect_uri: redirectUri,
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
