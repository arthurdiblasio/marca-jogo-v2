"use client";

import { Chrome } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/dist/client/components/navigation";


export function GoogleButton() {
  const router = useRouter();
  const login = useGoogleLogin({
    flow: "auth-code",

    onSuccess: async (response) => {

      const apiResponse = await fetch(
        "/api/auth/google",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            code: response.code,
            redirectUri:
              window.location.origin,
          }),
        },
      );
      if (!apiResponse.ok) {
        throw new Error(
          "Google authentication failed",
        );
      }

      router.replace("/dashboard");
    },

    onError: () => {
      console.error(
        "Google login failed",
      );
    },
  });

  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => login()}
      className="
        border
        border-slate-300
        bg-white
        hover:bg-slate-50
      "
    >
      <Chrome className="mr-2 h-4 w-4" />

      Continuar com Google
    </Button>
  );
}