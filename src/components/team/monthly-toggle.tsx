"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { cn } from "@/lib/cn";
import { updateMembershipMonthlyAction } from "@/modules/organizations/actions/update-membership-monthly";

export function MonthlyToggle({
  membershipId,
  isMonthly,
  editable,
}: {
  membershipId: string;
  isMonthly: boolean;
  editable: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(isMonthly);

  if (!editable) {
    return (
      <span
        className={cn(
          "rounded-full px-3 py-1 text-xs font-bold",
          value ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground",
        )}
      >
        {value ? "Mensalista" : "Avulso"}
      </span>
    );
  }

  function handleToggle() {
    const next = !value;
    setValue(next);
    startTransition(async () => {
      try {
        await updateMembershipMonthlyAction({ membershipId, isMonthly: next });
        router.refresh();
      } catch (error) {
        setValue(!next);
        toast.error(error instanceof Error ? error.message : "Erro ao atualizar jogador");
      }
    });
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={handleToggle}
      className={cn(
        "rounded-full px-3 py-1 text-xs font-bold transition disabled:opacity-50",
        value ? "bg-primary/15 text-primary hover:bg-primary/25" : "bg-muted text-muted-foreground hover:bg-muted",
      )}
    >
      {value ? "Mensalista" : "Avulso"}
    </button>
  );
}
