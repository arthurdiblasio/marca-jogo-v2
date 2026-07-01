"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Copy, UserPlus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createPlayerInviteAction } from "@/modules/player-invites/actions/create-player-invite";
import { cancelPlayerInviteAction } from "@/modules/player-invites/actions/cancel-player-invite";
import type { PlayerInviteSummary } from "@/modules/player-invites/types";

function buildInviteLink(token: string) {
  return `${window.location.origin}/convite/${token}`;
}

async function copyLink(token: string) {
  await navigator.clipboard.writeText(buildInviteLink(token));
  toast.success("Link copiado!");
}

export function InvitePlayerSection({ pendingInvites }: { pendingInvites: PlayerInviteSummary[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [newInviteToken, setNewInviteToken] = useState<string | null>(null);

  function handleCreate() {
    startTransition(async () => {
      try {
        const invite = await createPlayerInviteAction();
        setNewInviteToken(invite.token);
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao gerar convite");
      }
    });
  }

  function handleCancel(inviteId: string) {
    startTransition(async () => {
      try {
        await cancelPlayerInviteAction(inviteId);
        toast.success("Convite cancelado");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao cancelar convite");
      }
    });
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-black text-slate-900">Convidar jogador</h2>
        <Button size="sm" className="w-auto" disabled={isPending} onClick={handleCreate}>
          <UserPlus className="size-4" />
          Gerar link de convite
        </Button>
      </div>

      {newInviteToken && (
        <Card className="flex items-center justify-between gap-3 p-4">
          <p className="truncate text-sm text-slate-600">{buildInviteLink(newInviteToken)}</p>
          <Button size="sm" variant="outline" className="w-auto shrink-0" onClick={() => copyLink(newInviteToken)}>
            <Copy className="size-4" />
            Copiar
          </Button>
        </Card>
      )}

      {pendingInvites.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-500">Convites pendentes</p>
          {pendingInvites.map((invite) => (
            <Card key={invite.id} className="flex items-center justify-between gap-3 p-4">
              <p className="truncate text-sm text-slate-600">{buildInviteLink(invite.token)}</p>
              <div className="flex shrink-0 items-center gap-2">
                <Button size="sm" variant="outline" className="w-auto" onClick={() => copyLink(invite.token)}>
                  <Copy className="size-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="w-auto"
                  disabled={isPending}
                  onClick={() => handleCancel(invite.id)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
