import { makeGetCurrentUserUseCase } from "@/modules/auth/application/factories/make-get-current-user-use-case";
import { JwtService } from "@/shared/security/jwt-service";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const token = cookieStore.get("access_token")?.value;

    if (!token) {
      return NextResponse.json({
        authenticated: false,
      });
    }

    const jwtService = new JwtService();

    const payload = await jwtService.verify(token);

    const useCase = makeGetCurrentUserUseCase();

    const user = await useCase.execute(payload.id);

    if (!user) {
      return NextResponse.json({
        authenticated: false,
      });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        profile: user.profile,
      },
    });
  } catch {
    return NextResponse.json({
      authenticated: false,
    });
  }
}
