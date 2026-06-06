import { registerUser } from "@/modules/auth/actions/register-user";
import { registerUserSchema } from "@/modules/auth/schemas/register-user-schema";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const data = registerUserSchema.parse(body);

    const user = await registerUser(data);

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
          errors: error.flatten(),
        },
        {
          status: 400,
        },
      );
    }

    if (error instanceof Error && error.message === "Email already exists") {
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
