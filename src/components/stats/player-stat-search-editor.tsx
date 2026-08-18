"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Pencil, Search, User, UserPlus, X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export type StatCandidate = {
  kind: "user" | "guest";
  id: string;
  name: string;
  imageUrl: string | null;
};

export type StatEntry = StatCandidate & {
  goals: number;
  assists: number;
  yellowCards?: number;
  redCards?: number;
};

function entryKey(entry: { kind: string; id: string }) {
  return `${entry.kind}:${entry.id}`;
}

export function PlayerStatSearchEditor({
  candidates,
  initialEntries,
  trackCards = false,
  onSave,
  onRemove,
}: {
  candidates: StatCandidate[];
  initialEntries: StatEntry[];
  trackCards?: boolean;
  onSave: (
    entries: {
      kind: "user" | "guest";
      id: string;
      goals: number;
      assists: number;
      yellowCards?: number;
      redCards?: number;
    }[],
  ) => Promise<void>;
  onRemove: (entry: { kind: "user" | "guest"; id: string }) => Promise<void>;
}) {
  const router = useRouter();
  const [entries, setEntries] = useState(initialEntries);
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isEditing, setIsEditing] = useState(initialEntries.length === 0);

  const addedKeys = useMemo(() => new Set(entries.map(entryKey)), [entries]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const normalized = query.trim().toLowerCase();
    return candidates
      .filter((c) => !addedKeys.has(entryKey(c)) && c.name.toLowerCase().includes(normalized))
      .slice(0, 6);
  }, [query, candidates, addedKeys]);

  function addCandidate(candidate: StatCandidate) {
    setEntries((prev) => [
      ...prev,
      { ...candidate, goals: 0, assists: 0, ...(trackCards ? { yellowCards: 0, redCards: 0 } : {}) },
    ]);
    setQuery("");
  }

  function updateEntry(key: string, patch: Partial<StatEntry>) {
    setEntries((prev) => prev.map((e) => (entryKey(e) === key ? { ...e, ...patch } : e)));
  }

  function handleRemove(entry: StatEntry) {
    setEntries((prev) => prev.filter((e) => entryKey(e) !== entryKey(entry)));
    startTransition(async () => {
      try {
        await onRemove({ kind: entry.kind, id: entry.id });
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao remover jogador");
      }
    });
  }

  function handleSave() {
    startTransition(async () => {
      try {
        await onSave(
          entries.map((e) => ({
            kind: e.kind,
            id: e.id,
            goals: e.goals,
            assists: e.assists,
            ...(trackCards ? { yellowCards: e.yellowCards ?? 0, redCards: e.redCards ?? 0 } : {}),
          })),
        );
        toast.success("Estatísticas salvas!");
        setIsEditing(false);
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao salvar estatísticas");
      }
    });
  }

  return (
    <div className="space-y-3">
      {!isEditing && (
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <Pencil className="size-3.5" />
            Editar
          </button>
        </div>
      )}

      {isEditing && (
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground/60" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar jogador para adicionar..."
            className="pl-11"
          />

          {results.length > 0 && (
            <Card className="absolute z-10 mt-1.5 w-full overflow-hidden p-1.5">
              {results.map((candidate) => (
                <button
                  key={entryKey(candidate)}
                  type="button"
                  onClick={() => addCandidate(candidate)}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition hover:bg-muted"
                >
                  <Avatar className="size-7 rounded-lg bg-primary/10">
                    {candidate.imageUrl && <AvatarImage src={candidate.imageUrl} alt={candidate.name} />}
                    <AvatarFallback className="rounded-lg bg-transparent text-xs">
                      <User className="size-3.5 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
                    {candidate.name}
                  </span>
                  {candidate.kind === "guest" && (
                    <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[0.65rem] font-bold text-amber-700 dark:bg-amber-500/15 dark:text-amber-400">
                      Convidado
                    </span>
                  )}
                </button>
              ))}
            </Card>
          )}
        </div>
      )}

      {entries.length === 0 ? (
        <p className="rounded-xl border-2 border-dashed border-border p-4 text-center text-sm text-muted-foreground">
          Busque e adicione os jogadores que participaram.
        </p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => {
            const key = entryKey(entry);
            return (
              <Card key={key} className="flex flex-wrap items-center justify-between gap-3 p-3.5">
                <div className="flex min-w-0 items-center gap-2.5">
                  <Avatar className="size-9 rounded-xl bg-primary/10">
                    {entry.imageUrl && <AvatarImage src={entry.imageUrl} alt={entry.name} />}
                    <AvatarFallback className="rounded-xl bg-transparent">
                      {entry.kind === "guest" ? (
                        <UserPlus className="size-4 text-amber-500" />
                      ) : (
                        <User className="size-4 text-primary" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate font-bold text-foreground">{entry.name}</p>
                    {entry.kind === "guest" && <p className="text-xs font-semibold text-amber-600">Convidado</p>}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    Gols
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={entry.goals}
                      disabled={!isEditing}
                      onChange={(e) => updateEntry(key, { goals: Number(e.target.value) })}
                      className="w-14 rounded-lg border-2 border-border px-2 py-1.5 text-center font-bold text-foreground outline-none focus:border-primary disabled:opacity-60"
                    />
                  </label>

                  <label className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    Assist.
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={entry.assists}
                      disabled={!isEditing}
                      onChange={(e) => updateEntry(key, { assists: Number(e.target.value) })}
                      className="w-14 rounded-lg border-2 border-border px-2 py-1.5 text-center font-bold text-foreground outline-none focus:border-primary disabled:opacity-60"
                    />
                  </label>

                  {trackCards && (
                    <>
                      <label className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <span className="inline-block h-3.5 w-2.5 rounded-[2px] bg-amber-400" />
                        <input
                          type="number"
                          min={0}
                          max={2}
                          value={entry.yellowCards ?? 0}
                          disabled={!isEditing}
                          onChange={(e) => updateEntry(key, { yellowCards: Number(e.target.value) })}
                          className="w-12 rounded-lg border-2 border-amber-200 px-2 py-1.5 text-center font-bold text-foreground outline-none focus:border-amber-400 disabled:opacity-60"
                        />
                      </label>

                      <label className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <span className="inline-block h-3.5 w-2.5 rounded-[2px] bg-rose-500" />
                        <input
                          type="number"
                          min={0}
                          max={1}
                          value={entry.redCards ?? 0}
                          disabled={!isEditing}
                          onChange={(e) => updateEntry(key, { redCards: Number(e.target.value) })}
                          className="w-12 rounded-lg border-2 border-rose-200 px-2 py-1.5 text-center font-bold text-foreground outline-none focus:border-rose-400 disabled:opacity-60"
                        />
                      </label>
                    </>
                  )}

                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => handleRemove(entry)}
                      className="text-muted-foreground/60 transition hover:text-red-500"
                    >
                      <X className="size-4" />
                    </button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {isEditing && entries.length > 0 && (
        <Button onClick={handleSave} disabled={isPending} className="w-full">
          {isPending ? "Salvando..." : "Salvar estatísticas"}
        </Button>
      )}
    </div>
  );
}
