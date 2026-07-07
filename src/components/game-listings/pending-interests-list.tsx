"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CalendarDays, MapPin, Shield } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { acceptResponseAction } from "@/modules/game-listings/actions/accept-response";
import { formatListingDateTime } from "@/modules/game-listings/lib/format";
import type { PendingGameListingResponse } from "@/modules/game-listings/types";

export function PendingInterestsList({ responses }: { responses: PendingGameListingResponse[] }) {
  const router = useRouter();
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

  async function handleAccept(gameListingId: string, responseId: string) {
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
    return <p className="text-sm text-muted-foreground">Nenhum interesse pendente no momento.</p>;
  }

  return (
    <div className="space-y-3">
      {responses.map((response) => (
        <Card key={response.id} className="space-y-3 p-4">
          <Link
            href={`/jogos/${response.gameListing.id}`}
            className="block text-sm font-semibold text-muted-foreground hover:text-primary"
          >
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4" />
              <span className="capitalize">{formatListingDateTime(response.gameListing.scheduledAt)}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" />
              {response.gameListing.location} — {response.gameListing.city}/{response.gameListing.state}
            </span>
          </Link>

          <div className="flex items-center justify-between gap-3">
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

            <Button
              size="sm"
              className="w-auto"
              disabled={acceptingId === response.id}
              onClick={() => handleAccept(response.gameListing.id, response.id)}
            >
              {acceptingId === response.id ? "Aceitando..." : "Aceitar"}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
