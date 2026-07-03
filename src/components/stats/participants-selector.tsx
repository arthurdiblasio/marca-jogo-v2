"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export type ParticipantMember = {
  userId: string;
  name: string;
  imageUrl: string | null;
};

export function ParticipantsSelector({
  members,
  initialDeclinedUserIds,
  onSave,
}: {
  members: ParticipantMember[];
  initialDeclinedUserIds: string[];
  onSave: (declinedUserIds: string[]) => Promise<void>;
}) {
  const router = useRouter();
  const [declined, setDeclined] = useState(() => new Set(initialDeclinedUserIds));
  const [isPending, startTransition] = useTransition();

  const participatingCount = members.length - declined.size;

  function toggle(userId: string) {
    setDeclined((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
      } else {
        next.add(userId);
      }
      return next;
    });
  }

  function handleSave() {
    startTransition(async () => {
      try {
        await onSave([...declined]);
        toast.success("Participantes atualizados!");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao salvar participantes");
      }
    });
  }

  const allChecked = useMemo(() => declined.size === 0, [declined]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          {participatingCount} de {members.length} participando
        </p>
        <button
          type="button"
          onClick={() => setDeclined(allChecked ? new Set(members.map((m) => m.userId)) : new Set())}
          className="text-sm font-semibold text-primary"
        >
          {allChecked ? "Desmarcar todos" : "Marcar todos"}
        </button>
      </div>

      <div className="space-y-2">
        {members.map((member) => {
          const isParticipating = !declined.has(member.userId);
          return (
            <Card
              key={member.userId}
              className={cn(
                "flex items-center justify-between gap-3 p-3 transition",
                !isParticipating && "opacity-50",
              )}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <Avatar className="size-9 rounded-xl bg-green-50">
                  {member.imageUrl && <AvatarImage src={member.imageUrl} alt={member.name} />}
                  <AvatarFallback className="rounded-xl bg-transparent">
                    <User className="size-4 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <p className="min-w-0 truncate font-bold text-slate-900">{member.name}</p>
              </div>

              <button
                type="button"
                onClick={() => toggle(member.userId)}
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-lg border-2 transition",
                  isParticipating
                    ? "border-primary bg-primary text-white"
                    : "border-slate-200 bg-white text-transparent",
                )}
              >
                <Check className="size-4" />
              </button>
            </Card>
          );
        })}
      </div>

      <Button onClick={handleSave} disabled={isPending} className="w-full">
        {isPending ? "Salvando..." : "Salvar participantes"}
      </Button>
    </div>
  );
}
