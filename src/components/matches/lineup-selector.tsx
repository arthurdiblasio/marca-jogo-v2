"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Star, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";

export type LineupMember = {
  userId: string;
  name: string;
  imageUrl: string | null;
  defaultPosition: string;
};

export type LineupEntry = {
  userId: string;
  position: string;
  isStarter: boolean;
};

export function LineupSelector({
  members,
  initialEntries,
  onSave,
}: {
  members: LineupMember[];
  initialEntries: LineupEntry[];
  onSave: (entries: LineupEntry[]) => Promise<void>;
}) {
  const router = useRouter();
  const [entries, setEntries] = useState<Map<string, LineupEntry>>(
    () => new Map(initialEntries.map((entry) => [entry.userId, entry])),
  );
  const [isPending, startTransition] = useTransition();

  function cycleStatus(member: LineupMember) {
    setEntries((prev) => {
      const next = new Map(prev);
      const current = next.get(member.userId);

      if (!current) {
        next.set(member.userId, { userId: member.userId, position: member.defaultPosition, isStarter: false });
      } else if (!current.isStarter) {
        next.set(member.userId, { ...current, isStarter: true });
      } else {
        next.delete(member.userId);
      }
      return next;
    });
  }

  function updatePosition(userId: string, position: string) {
    setEntries((prev) => {
      const current = prev.get(userId);
      if (!current) return prev;
      const next = new Map(prev);
      next.set(userId, { ...current, position });
      return next;
    });
  }

  function handleSave() {
    startTransition(async () => {
      try {
        await onSave([...entries.values()]);
        toast.success("Escalação atualizada!");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao salvar escalação");
      }
    });
  }

  const starterCount = [...entries.values()].filter((e) => e.isStarter).length;
  const reserveCount = entries.size - starterCount;

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        {starterCount} titulares · {reserveCount} reservas. Toque para alternar: fora → reserva → titular.
      </p>

      <div className="space-y-2">
        {members.map((member) => {
          const entry = entries.get(member.userId);
          const status = !entry ? "out" : entry.isStarter ? "starter" : "reserve";

          return (
            <Card key={member.userId} className={cn("flex items-center gap-3 p-3", status === "out" && "opacity-50")}>
              <button type="button" onClick={() => cycleStatus(member)} className="flex min-w-0 flex-1 items-center gap-2.5">
                <Avatar className="size-9 shrink-0 rounded-xl bg-primary/10">
                  {member.imageUrl && <AvatarImage src={member.imageUrl} alt={member.name} />}
                  <AvatarFallback className="rounded-xl bg-transparent">
                    <User className="size-4 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <p className="min-w-0 truncate font-bold text-foreground">{member.name}</p>
              </button>

              {entry?.isStarter && (
                <Input
                  value={entry.position}
                  onChange={(e) => updatePosition(member.userId, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="Posição"
                  className="!w-24 !px-2.5 !py-2 text-center text-sm"
                />
              )}

              <span
                className={cn(
                  "shrink-0 rounded-lg border-2 px-2.5 py-1.5 text-xs font-black",
                  status === "starter" && "border-primary bg-primary text-primary-foreground",
                  status === "reserve" && "border-border bg-muted text-muted-foreground",
                  status === "out" && "border-border text-transparent",
                )}
              >
                {status === "starter" ? (
                  <span className="flex items-center gap-1">
                    <Star className="size-3" />
                    Titular
                  </span>
                ) : status === "reserve" ? (
                  "Reserva"
                ) : (
                  "Fora"
                )}
              </span>
            </Card>
          );
        })}
      </div>

      <Button onClick={handleSave} disabled={isPending} className="w-full">
        {isPending ? "Salvando..." : "Salvar escalação"}
      </Button>
    </div>
  );
}
