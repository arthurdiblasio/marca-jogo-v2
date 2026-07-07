"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { acceptResponseAction } from "@/modules/game-listings/actions/accept-response";
import type { GameListingDetail } from "@/modules/game-listings/types";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Aguardando",
  ACCEPTED: "Aceito",
  DECLINED: "Recusado",
};

const STATUS_CLASS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  ACCEPTED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  DECLINED: "bg-muted text-muted-foreground",
};

export function GameListingResponsesList({
  gameListingId,
  responses,
  canAccept,
}: {
  gameListingId: string;
  responses: GameListingDetail["responses"];
  canAccept: boolean;
}) {
  const router = useRouter();
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  async function handleAccept(responseId: string) {
    setAcceptingId(responseId);
    try {
      await acceptResponseAction({ gameListingId, responseId });
      toast.success("Jogo fechado com sucesso!");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao aceitar interessado");
    } finally {
      setAcceptingId(null);
    }
  }

  if (responses.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhum time demonstrou interesse ainda.</p>;
  }

  return (
    <div className="space-y-3">
      {responses.map((response) => (
        <Card key={response.id} className="flex items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-10 rounded-xl bg-primary/10">
              {response.organization.logoUrl && (
                <AvatarImage src={response.organization.logoUrl} alt={response.organization.name} />
              )}
              <AvatarFallback className="rounded-xl bg-transparent">
                <Shield className="size-5 text-primary" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-foreground">{response.organization.name}</p>
              {response.message && <p className="text-sm text-muted-foreground">{response.message}</p>}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_CLASS[response.status]}`}>
              {STATUS_LABEL[response.status]}
            </span>
            {canAccept && response.status === "PENDING" && (
              <Button
                size="sm"
                className="w-auto"
                disabled={acceptingId === response.id}
                onClick={() => handleAccept(response.id)}
              >
                {acceptingId === response.id ? "Aceitando..." : "Aceitar"}
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}
