"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowDownCircle, ArrowUpCircle, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { formatPriceCents } from "@/modules/game-listings/lib/format";
import { updateFinancialTransactionStatusAction } from "@/modules/financial-transactions/actions/update-financial-transaction-status";
import { removeFinancialTransactionAction } from "@/modules/financial-transactions/actions/remove-financial-transaction";
import { cn } from "@/lib/utils";

type Transaction = {
  id: string;
  type: "INCOME" | "EXPENSE";
  status: "PENDING" | "PAID" | "CANCELLED";
  amountCents: number;
  description: string;
  occurredAt: Date;
  createdBy: { profile: { fullName: string | null } | null } | null;
};

const STATUS_LABEL: Record<Transaction["status"], string> = {
  PENDING: "Pendente",
  PAID: "Pago",
  CANCELLED: "Cancelado",
};

export function TransactionList({ transactions, isManager }: { transactions: Transaction[]; isManager: boolean }) {
  const router = useRouter();
  const [removingId, setRemovingId] = useState<string | null>(null);

  async function handleStatusChange(id: string, status: Transaction["status"]) {
    try {
      await updateFinancialTransactionStatusAction({ id, status });
      toast.success("Status atualizado!");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao atualizar status");
    }
  }

  async function handleRemove(id: string) {
    try {
      await removeFinancialTransactionAction({ id });
      toast.success("Transação removida!");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao remover transação");
    }
  }

  if (transactions.length === 0) {
    return <Card className="p-5 text-sm text-muted-foreground">Nenhuma transação registrada ainda.</Card>;
  }

  return (
    <div className="space-y-2">
      {transactions.map((transaction) => {
        const Icon = transaction.type === "INCOME" ? ArrowUpCircle : ArrowDownCircle;
        return (
          <Card key={transaction.id} className="flex items-center gap-3 p-4">
            <Icon
              className={cn("size-8 shrink-0", transaction.type === "INCOME" ? "text-primary" : "text-red-500")}
            />

            <div className="min-w-0 flex-1">
              <p className="truncate font-bold text-foreground">{transaction.description}</p>
              <p className="caption text-muted-foreground">
                {format(transaction.occurredAt, "dd/MM/yyyy", { locale: ptBR })}
                {transaction.createdBy?.profile?.fullName ? ` · ${transaction.createdBy.profile.fullName}` : ""}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <span
                className={cn(
                  "text-lg font-black",
                  transaction.type === "INCOME" ? "text-primary" : "text-red-500",
                )}
              >
                {transaction.type === "INCOME" ? "+" : "-"}
                {formatPriceCents(transaction.amountCents)}
              </span>

              {isManager ? (
                <select
                  value={transaction.status}
                  onChange={(e) => handleStatusChange(transaction.id, e.target.value as Transaction["status"])}
                  className="rounded-lg border-2 border-border bg-card px-2 py-1.5 text-xs font-bold text-foreground outline-none focus:border-primary"
                >
                  {Object.entries(STATUS_LABEL).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              ) : (
                <span className="rounded-lg bg-muted px-2 py-1.5 text-xs font-bold text-muted-foreground">
                  {STATUS_LABEL[transaction.status]}
                </span>
              )}

              {isManager && (
                <button
                  type="button"
                  onClick={() => setRemovingId(transaction.id)}
                  className="text-muted-foreground hover:text-red-500"
                  aria-label="Remover transação"
                >
                  <Trash2 className="size-4" />
                </button>
              )}
            </div>

            <ConfirmDialog
              open={removingId === transaction.id}
              onOpenChange={(open) => !open && setRemovingId(null)}
              title="Remover transação?"
              description="Essa ação não pode ser desfeita."
              variant="destructive"
              confirmLabel="Remover"
              onConfirm={() => handleRemove(transaction.id)}
            />
          </Card>
        );
      })}
    </div>
  );
}
