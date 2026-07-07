"use client";

import { useState } from "react";

import { Chrome } from "lucide-react";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FootballLoading } from "@/components/loading/football-loading";
import { useRouter } from "next/dist/client/components/navigation";


export function GoogleButton() {
  const router = useRouter();
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const login = useGoogleLogin({
    flow: "auth-code",

    onSuccess: async (response) => {
      setIsAuthenticating(true);

      try {
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
      } catch (error) {
        setIsAuthenticating(false);
        toast.error(
          error instanceof Error
            ? error.message
            : "Erro ao realizar login com Google",
        );
      }
    },

    onError: () => {
      console.error(
        "Google login failed",
      );
      toast.error(
        "Erro ao realizar login com Google",
      );
    },
  });

  return (
    <>
      {isAuthenticating && (
        <FootballLoading overlay />
      )}

      <Button
        type="button"
        variant="ghost"
        onClick={() => login()}
        disabled={isAuthenticating}
        className="
          border
          border-border
          bg-card
          hover:bg-muted
        "
      >
        <Chrome className="mr-2 h-4 w-4" />

        Continuar com Google
      </Button>
    </>
  );
}