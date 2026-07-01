"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { acceptResponseAction } from "@/modules/game-listings/actions/accept-response";
import type { GameListingDetail } from "@/modules/game-listings/types";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Aguardando",
  ACCEPTED: "Aceito",
  DECLINED: "Recusado",
};

const STATUS_CLASS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  ACCEPTED: "bg-emerald-100 text-emerald-700",
  DECLINED: "bg-slate-100 text-slate-500",
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
    return <p className="text-sm text-slate-400">Nenhum time demonstrou interesse ainda.</p>;
  }

  return (
    <div className="space-y-3">
      {responses.map((response) => (
        <Card key={response.id} className="flex items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-green-50">
              <Shield className="size-5 text-primary" />
            </div>
            <div>
              <p className="font-bold text-slate-900">{response.organization.name}</p>
              {response.message && <p className="text-sm text-slate-500">{response.message}</p>}
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
