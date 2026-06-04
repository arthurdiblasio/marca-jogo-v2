import { Banknote, TrendingDown, TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { ComponentState } from "@/types/design-system";
import { ComponentStateView } from "./component-state";

type FinancialCardProps = {
  balance: string;
  income: string;
  expenses: string;
  state?: ComponentState;
};

export function FinancialCard({ balance, income, expenses, state = "success" }: FinancialCardProps) {
  if (state !== "success") {
    return (
      <Card className="p-4">
        <ComponentStateView state={state} />
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="caption text-primary">Financeiro</p>
          <p className="mt-2 text-3xl font-black">{balance}</p>
          <p className="body-sm mt-1 text-muted-foreground">Saldo disponivel do grupo</p>
        </div>
        <div className="grid size-12 place-items-center rounded-xl bg-accent text-accent-foreground">
          <Banknote className="size-6" />
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-success/10 p-3 text-success">
          <TrendingUp className="size-5" />
          <p className="mt-2 font-black">{income}</p>
          <p className="caption">Entradas</p>
        </div>
        <div className="rounded-lg bg-danger/10 p-3 text-danger">
          <TrendingDown className="size-5" />
          <p className="mt-2 font-black">{expenses}</p>
          <p className="caption">Saidas</p>
        </div>
      </div>
    </Card>
  );
}
