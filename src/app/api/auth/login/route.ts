import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { loginUser } from "@/modules/auth/actions/login-user";
import { loginUserSchema } from "@/modules/auth/schemas/login-user-schema";
import { createSession } from "@/shared/auth/auth-session";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const data = loginUserSchema.parse(body);

    const user = await loginUser(data);

    await createSession({
      id: user.id,
      email: user.email,
    });
    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          errors: error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
