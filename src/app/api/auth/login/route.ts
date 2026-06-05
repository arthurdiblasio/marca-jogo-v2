import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { ZodError } from "zod";

import { makeLoginUserUseCase } from "@/modules/auth/application/factories/make-login-user-use-case";

import { InvalidCredentialsError } from "@/modules/auth/application/errors/invalid-credentials-error";

import { loginUserSchema } from "@/modules/auth/presentation/validators/login-user.schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const data = loginUserSchema.parse(body);

    const useCase = makeLoginUserUseCase();

    const result = await useCase.execute(data);

    const cookieStore = await cookies();

    cookieStore.set("access_token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      success: true,
      data: result.user,
    });
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 401,
        },
      );
    }

    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors: error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    console.error(error);

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
