"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { acceptPlayerInviteAction } from "@/modules/player-invites/actions/accept-player-invite";

export function PendingInviteModal({
  token,
  organizationName,
  organizationLogoUrl,
}: {
  token: string;
  organizationName: string;
  organizationLogoUrl?: string | null;
}) {
  const router = useRouter();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (isDismissed) {
    return null;
  }

  function handleAccept() {
    startTransition(async () => {
      try {
        const result = await acceptPlayerInviteAction(token);
        toast.success(`Você entrou em ${result.organizationName}!`);
        router.replace("/dashboard");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao aceitar convite");
        setIsDismissed(true);
        router.replace("/dashboard");
      }
    });
  }

  function handleDismiss() {
    setIsDismissed(true);
    router.replace("/dashboard");
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 px-4">
      <Card className="w-full max-w-sm space-y-4 p-6 text-center">
        <Avatar className="mx-auto size-14 rounded-2xl bg-green-50">
          {organizationLogoUrl && <AvatarImage src={organizationLogoUrl} alt={organizationName} />}
          <AvatarFallback className="rounded-2xl bg-transparent">
            <Shield className="size-7 text-primary" />
          </AvatarFallback>
        </Avatar>

        <div>
          <h2 className="text-lg font-black text-slate-900">{organizationName} te convidou!</h2>
          <p className="text-sm text-slate-500">Aceite o convite para entrar na organização.</p>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={handleAccept} disabled={isPending}>
            {isPending ? "Entrando..." : "Aceitar convite"}
          </Button>
          <Button variant="outline" onClick={handleDismiss} disabled={isPending}>
            Agora não
          </Button>
        </div>
      </Card>
    </div>
  );
}
