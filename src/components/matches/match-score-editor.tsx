"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function MatchScoreEditor({
  homeLabel,
  awayLabel,
  homeScore,
  awayScore,
  onSave,
}: {
  homeLabel: string;
  awayLabel: string;
  homeScore: number | null;
  awayScore: number | null;
  onSave: (homeScore: number, awayScore: number) => Promise<void>;
}) {
  const router = useRouter();
  const [home, setHome] = useState(homeScore ?? 0);
  const [away, setAway] = useState(awayScore ?? 0);
  const [isPending, startTransition] = useTransition();

  function handleSave() {
    startTransition(async () => {
      try {
        await onSave(home, away);
        toast.success("Placar salvo!");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao salvar placar");
      }
    });
  }

  return (
    <Card className="space-y-3 p-4">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Placar</p>
      <div className="flex items-center justify-center gap-4">
        <div className="flex flex-col items-center gap-1.5">
          <span className="max-w-24 truncate text-sm font-semibold text-slate-600">{homeLabel}</span>
          <input
            type="number"
            min={0}
            max={99}
            value={home}
            onChange={(e) => setHome(Number(e.target.value))}
            className="w-16 rounded-lg border-2 border-slate-200 px-2 py-2 text-center text-2xl font-black text-slate-900 outline-none focus:border-[#16A34A]"
          />
        </div>
        <span className="text-lg font-black text-slate-300">x</span>
        <div className="flex flex-col items-center gap-1.5">
          <span className="max-w-24 truncate text-sm font-semibold text-slate-600">{awayLabel}</span>
          <input
            type="number"
            min={0}
            max={99}
            value={away}
            onChange={(e) => setAway(Number(e.target.value))}
            className="w-16 rounded-lg border-2 border-slate-200 px-2 py-2 text-center text-2xl font-black text-slate-900 outline-none focus:border-[#16A34A]"
          />
        </div>
      </div>
      <Button size="sm" className="w-full" disabled={isPending} onClick={handleSave}>
        {isPending ? "Salvando..." : "Salvar placar"}
      </Button>
    </Card>
  );
}
