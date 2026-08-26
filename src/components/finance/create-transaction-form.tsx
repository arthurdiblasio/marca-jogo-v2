"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createFinancialTransactionAction } from "@/modules/financial-transactions/actions/create-financial-transaction";

function toDateInputValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function CreateTransactionForm({ organizationId }: { organizationId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"INCOME" | "EXPENSE">("INCOME");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [occurredAt, setOccurredAt] = useState(toDateInputValue(new Date()));
  const [recurrenceDays, setRecurrenceDays] = useState<7 | 15 | 30 | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) {
    return (
      <Button size="sm" className="w-auto" onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        Nova transação
      </Button>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const amountCents = Math.round(Number(amount.replace(",", ".")) * 100);
    if (!amountCents || amountCents <= 0) {
      toast.error("Informe um valor válido");
      return;
    }

    setIsSubmitting(true);
    try {
      await createFinancialTransactionAction({
        organizationId,
        type,
        amountCents,
        description,
        occurredAt,
        recurrenceDays,
      });
      toast.success(
        recurrenceDays
          ? `Transação recorrente registrada (a cada ${recurrenceDays} dias)!`
          : "Transação registrada!",
      );
      setOpen(false);
      setAmount("");
      setDescription("");
      setRecurrenceDays(null);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao registrar transação");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <p className="font-bold text-foreground">Nova transação</p>
        <button type="button" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
          <X className="size-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setType("INCOME")}
            className={cn(
              "flex-1 rounded-xl border-2 py-3 text-sm font-bold transition",
              type === "INCOME" ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground",
            )}
          >
            Entrada
          </button>
          <button
            type="button"
            onClick={() => setType("EXPENSE")}
            className={cn(
              "flex-1 rounded-xl border-2 py-3 text-sm font-bold transition",
              type === "EXPENSE" ? "border-red-400 bg-red-400/10 text-red-500" : "border-border text-muted-foreground",
            )}
          >
            Saída
          </button>
        </div>

        <FormField label="Valor (R$)" htmlFor="amount">
          <Input
            id="amount"
            inputMode="decimal"
            placeholder="0,00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </FormField>

        <FormField label="Descrição" htmlFor="description">
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            minLength={3}
          />
        </FormField>

        <FormField label="Data" htmlFor="occurredAt">
          <Input
            id="occurredAt"
            type="date"
            value={occurredAt}
            onChange={(e) => setOccurredAt(e.target.value)}
            required
          />
        </FormField>

        <FormField
          label="Recorrência"
          htmlFor="recurrenceDays"
          description={recurrenceDays ? "Lança automaticamente as próximas ocorrências pelos próximos 12 meses." : undefined}
        >
          <div className="flex gap-2">
            {([null, 7, 15, 30] as const).map((option) => (
              <button
                key={option ?? "none"}
                type="button"
                onClick={() => setRecurrenceDays(option)}
                className={cn(
                  "flex-1 rounded-xl border-2 py-2.5 text-sm font-bold transition",
                  recurrenceDays === option
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground",
                )}
              >
                {option === null ? "Nenhuma" : `${option} dias`}
              </button>
            ))}
          </div>
        </FormField>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Salvando..." : "Registrar transação"}
        </Button>
      </form>
    </Card>
  );
}
