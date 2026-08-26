"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Megaphone, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";

export type CallUpMember = {
  userId: string;
  name: string;
  imageUrl: string | null;
  status?: "PENDING" | "ACCEPTED" | "DECLINED";
};

const STATUS_LABEL: Record<NonNullable<CallUpMember["status"]>, string> = {
  PENDING: "Aguardando",
  ACCEPTED: "Confirmado",
  DECLINED: "Recusou",
};

export function CallUpSelector({
  members,
  initialSelectedUserIds,
  initialSlots,
  onSave,
}: {
  members: CallUpMember[];
  initialSelectedUserIds: string[];
  initialSlots: number | null;
  onSave: (userIds: string[], slots: number | null) => Promise<void>;
}) {
  const router = useRouter();
  const [selected, setSelected] = useState(() => new Set(initialSelectedUserIds));
  const [slots, setSlots] = useState(initialSlots != null ? String(initialSlots) : "");
  const [isPending, startTransition] = useTransition();

  function toggle(userId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  }

  function handleSave() {
    startTransition(async () => {
      try {
        await onSave([...selected], slots.trim() ? Number(slots) : null);
        toast.success("Convocação enviada!");
        router.refresh();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Erro ao convocar jogadores");
      }
    });
  }

  return (
    <div className="space-y-3">
      <FormField label="Vagas (opcional)" htmlFor="callUpSlots">
        <Input
          id="callUpSlots"
          type="number"
          min={1}
          placeholder="Sem limite"
          value={slots}
          onChange={(e) => setSlots(e.target.value)}
        />
      </FormField>

      <div className="space-y-2">
        {members.map((member) => {
          const isSelected = selected.has(member.userId);
          return (
            <Card
              key={member.userId}
              className={cn("flex items-center justify-between gap-3 p-3 transition", !isSelected && "opacity-60")}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <Avatar className="size-9 rounded-xl bg-primary/10">
                  {member.imageUrl && <AvatarImage src={member.imageUrl} alt={member.name} />}
                  <AvatarFallback className="rounded-xl bg-transparent">
                    <User className="size-4 text-primary" />
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-bold text-foreground">{member.name}</p>
                  {member.status && <p className="caption text-muted-foreground">{STATUS_LABEL[member.status]}</p>}
                </div>
              </div>

              <button
                type="button"
                onClick={() => toggle(member.userId)}
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-lg border-2 transition",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-transparent",
                )}
              >
                <Check className="size-4" />
              </button>
            </Card>
          );
        })}
      </div>

      <Button onClick={handleSave} disabled={isPending} className="w-full">
        <Megaphone className="size-4" />
        {isPending ? "Enviando..." : `Convocar ${selected.size} jogador${selected.size !== 1 ? "es" : ""}`}
      </Button>
    </div>
  );
}
