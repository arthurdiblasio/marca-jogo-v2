"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Star, Trophy, Lock, Play, Square } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type VotingPlayer = {
  userId: string;
  name: string;
  imageUrl: string | null;
};

export type VotingTallyEntry = {
  userId: string;
  name: string;
  count: number;
};

export type RatingTallyEntry = {
  userId: string;
  name: string;
  average: number;
  count: number;
};

export function VotingPanel({
  players,
  votingOpen,
  votingClosesAt,
  hasBeenOpened,
  isManager,
  currentMvpVote,
  currentRatings,
  mvpTally,
  ratingTally,
  onOpenVoting,
  onCloseVoting,
  onSubmitVote,
}: {
  players: VotingPlayer[];
  votingOpen: boolean;
  votingClosesAt: Date | null;
  hasBeenOpened: boolean;
  isManager: boolean;
  currentMvpVote: string | null;
  currentRatings: Record<string, number>;
  mvpTally: VotingTallyEntry[];
  ratingTally: RatingTallyEntry[];
  onOpenVoting: () => Promise<void>;
  onCloseVoting: () => Promise<void>;
  onSubmitVote: (mvpUserId: string, ratings: Record<string, number>) => Promise<void>;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [mvpUserId, setMvpUserId] = useState<string | null>(currentMvpVote);
  const [ratings, setRatings] = useState<Record<string, number>>(currentRatings);

  function handleManagerAction(action: () => Promise<void>) {
    startTransition(async () => {
      try {
        await action();
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao atualizar votação");
      }
    });
  }

  function handleSubmitVote() {
    if (!mvpUserId) {
      toast.error("Escolha o melhor em campo antes de votar.");
      return;
    }
    startTransition(async () => {
      try {
        await onSubmitVote(mvpUserId, ratings);
        toast.success(currentMvpVote ? "Voto atualizado!" : "Voto registrado!");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao registrar voto");
      }
    });
  }

  return (
    <div className="space-y-4">
      {isManager && (
        <Card className="flex flex-wrap items-center justify-between gap-3 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            {votingOpen ? (
              <>
                <Trophy className="size-4 text-primary" />
                <span>
                  Votação aberta
                  {votingClosesAt && ` · encerra ${votingClosesAt.toLocaleDateString("pt-BR")} às ${votingClosesAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`}
                </span>
              </>
            ) : (
              <>
                <Lock className="size-4" />
                <span>{hasBeenOpened ? "Votação encerrada" : "Votação ainda não foi aberta"}</span>
              </>
            )}
          </div>

          {votingOpen ? (
            <Button
              size="sm"
              variant="outline"
              className="w-auto"
              disabled={isPending}
              onClick={() => handleManagerAction(onCloseVoting)}
            >
              <Square className="size-4" />
              Encerrar votação
            </Button>
          ) : (
            <Button size="sm" className="w-auto" disabled={isPending} onClick={() => handleManagerAction(onOpenVoting)}>
              <Play className="size-4" />
              {hasBeenOpened ? "Reabrir votação" : "Abrir votação"}
            </Button>
          )}
        </Card>
      )}

      {votingOpen && (
        <Card className="space-y-4 p-4">
          <div>
            <p className="font-bold text-slate-900">Melhor em campo</p>
            <p className="text-sm text-slate-500">Escolha um jogador e dê uma nota para cada um.</p>
          </div>

          <div className="space-y-3">
            {players.map((player) => {
              const isMvp = mvpUserId === player.userId;
              const rating = ratings[player.userId] ?? 0;

              return (
                <div
                  key={player.userId}
                  className={cn(
                    "flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 p-3 transition",
                    isMvp ? "border-primary bg-green-50/60" : "border-slate-200",
                  )}
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <Avatar className="size-8 rounded-xl bg-green-50">
                      {player.imageUrl && <AvatarImage src={player.imageUrl} alt={player.name} />}
                      <AvatarFallback className="rounded-xl bg-transparent text-xs">
                        {player.name.slice(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <p className="min-w-0 truncate text-sm font-bold text-slate-900">{player.name}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRatings((prev) => ({ ...prev, [player.userId]: star }))}
                          className="text-amber-400"
                        >
                          <Star className={cn("size-4", star <= rating ? "fill-amber-400" : "fill-none")} />
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setMvpUserId(player.userId)}
                      className={cn(
                        "flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold transition",
                        isMvp ? "bg-primary text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200",
                      )}
                    >
                      <Trophy className="size-3.5" />
                      Melhor
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <Button onClick={handleSubmitVote} disabled={isPending} className="w-full">
            {isPending ? "Enviando..." : currentMvpVote ? "Atualizar meu voto" : "Confirmar voto"}
          </Button>
        </Card>
      )}

      {(mvpTally.length > 0 || ratingTally.length > 0) && (
        <Card className="space-y-4 p-4">
          <p className="font-bold text-slate-900">Resultado da votação</p>

          {mvpTally.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Melhor em campo</p>
              <div className="space-y-1.5">
                {mvpTally.map((entry, index) => (
                  <div key={entry.userId} className="flex items-center justify-between text-sm">
                    <span className={cn("font-semibold", index === 0 ? "text-slate-900" : "text-slate-500")}>
                      {index === 0 && "🏆 "}
                      {entry.name}
                    </span>
                    <span className="font-bold text-slate-700">{entry.count} voto{entry.count !== 1 ? "s" : ""}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {ratingTally.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Nota média</p>
              <div className="space-y-1.5">
                {ratingTally.map((entry) => (
                  <div key={entry.userId} className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-700">{entry.name}</span>
                    <span className="flex items-center gap-1 font-bold text-slate-900">
                      <Star className="size-3.5 fill-amber-400 text-amber-400" />
                      {entry.average.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
