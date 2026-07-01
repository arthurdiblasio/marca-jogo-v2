"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { acceptPlayerInviteAction } from "@/modules/player-invites/actions/accept-player-invite";

export function AcceptInviteButton({ token }: { token: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleAccept() {
    startTransition(async () => {
      try {
        const result = await acceptPlayerInviteAction(token);
        toast.success(`Você entrou em ${result.organizationName}!`);
        router.push("/dashboard");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao aceitar convite");
      }
    });
  }

  return (
    <Button onClick={handleAccept} disabled={isPending}>
      {isPending ? "Entrando..." : "Aceitar convite"}
    </Button>
  );
}
