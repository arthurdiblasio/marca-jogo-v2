import { NextResponse } from "next/server";

import { ZodError } from "zod";

import { makeRegisterUserUseCase } from "@/modules/auth/application/factories/make-register-user-use-case";

import { EmailAlreadyInUseError } from "@/modules/auth/application/errors/email-already-in-use-error";

import { registerUserSchema } from "@/modules/auth/presentation/validators/register-user.schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const data = registerUserSchema.parse(body);

    const useCase = makeRegisterUserUseCase();

    const user = await useCase.execute(data);

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
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

    if (error instanceof EmailAlreadyInUseError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        {
          status: 409,
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
