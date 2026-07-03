"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Copy, MessageCircle, Share2, UserPlus, X } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createPlayerInviteAction } from "@/modules/player-invites/actions/create-player-invite";
import { cancelPlayerInviteAction } from "@/modules/player-invites/actions/cancel-player-invite";
import type { PlayerInviteSummary } from "@/modules/player-invites/types";

function buildInviteLink(token: string) {
  return `${window.location.origin}/convite/${token}`;
}

function buildWhatsAppLink(token: string) {
  const text = `Bora jogar! Entra no time por esse link: ${buildInviteLink(token)}`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

async function shareInvite(token: string) {
  const link = buildInviteLink(token);
  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({ title: "Convite para o time", text: "Bora jogar! Entra no time por esse link:", url: link });
      return;
    } catch {
      // usuário cancelou o compartilhamento, cai para copiar
    }
  }
  await navigator.clipboard.writeText(link);
  toast.success("Link copiado!");
}

function InviteLinkRow({
  token,
  expiresAt,
  onCancel,
  isPending,
}: {
  token: string;
  expiresAt?: Date;
  onCancel?: () => void;
  isPending?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(buildInviteLink(token));
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card className="space-y-3 p-4">
      <div className="flex items-center gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-green-50">
          <UserPlus className="size-5 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-700">{buildInviteLink(token)}</p>
          {expiresAt && (
            <p className="text-xs text-slate-400">
              Expira em {formatDistanceToNowStrict(expiresAt, { locale: ptBR })} · qualquer pessoa com o link entra
              como jogador
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button size="sm" className="flex-1" onClick={handleCopy}>
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? "Copiado" : "Copiar link"}
        </Button>
        <Button size="sm" variant="outline" className="w-auto" asChild>
          <a href={buildWhatsAppLink(token)} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="size-4" />
          </a>
        </Button>
        <Button size="sm" variant="outline" className="w-auto" onClick={() => shareInvite(token)}>
          <Share2 className="size-4" />
        </Button>
        {onCancel && (
          <Button size="sm" variant="outline" className="w-auto" disabled={isPending} onClick={onCancel}>
            <X className="size-4" />
          </Button>
        )}
      </div>
    </Card>
  );
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
        if (pendingInvites.find((i) => i.id === inviteId)?.token === newInviteToken) {
          setNewInviteToken(null);
        }
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao cancelar convite");
      }
    });
  }

  const hasInvites = newInviteToken || pendingInvites.length > 0;

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-black text-slate-900">Convidar jogador</h2>
        <p className="text-sm text-slate-500">
          Gere um link e compartilhe com quem você quer no time. Ao abrir o link, a pessoa entra direto como
          jogador.
        </p>
      </div>

      {!hasInvites && (
        <Card className="flex flex-col items-center gap-3 p-6 text-center">
          <div className="grid size-12 place-items-center rounded-xl bg-green-50">
            <UserPlus className="size-6 text-primary" />
          </div>
          <Button className="w-auto" disabled={isPending} onClick={handleCreate}>
            <UserPlus className="size-4" />
            Gerar link de convite
          </Button>
        </Card>
      )}

      {hasInvites && (
        <div className="space-y-2">
          <Button size="sm" variant="outline" className="w-auto" disabled={isPending} onClick={handleCreate}>
            <UserPlus className="size-4" />
            Gerar novo link
          </Button>

          {newInviteToken && !pendingInvites.some((i) => i.token === newInviteToken) && (
            <InviteLinkRow token={newInviteToken} expiresAt={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)} />
          )}

          {pendingInvites.map((invite) => (
            <InviteLinkRow
              key={invite.id}
              token={invite.token}
              expiresAt={invite.expiresAt}
              isPending={isPending}
              onCancel={() => handleCancel(invite.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
