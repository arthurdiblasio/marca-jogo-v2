import { AlertTriangle, CheckCircle2, Loader2, Sparkles } from "lucide-react";

import type { ComponentState } from "@/types/design-system";

type ComponentStateViewProps = {
  state?: ComponentState;
  emptyLabel?: string;
};

export function ComponentStateView({ state, emptyLabel = "Nada para mostrar" }: ComponentStateViewProps) {
  if (!state || state === "success") {
    return null;
  }

  const config = {
    loading: { icon: Loader2, label: "Carregando", className: "animate-spin text-primary" },
    empty: { icon: Sparkles, label: emptyLabel, className: "text-muted-foreground" },
    error: { icon: AlertTriangle, label: "Nao foi possivel carregar", className: "text-danger" }
  }[state];

  const Icon = config.icon;

  return (
    <div className="grid min-h-32 place-items-center rounded-lg border border-dashed bg-muted/40 p-6 text-center">
      <div className="space-y-2">
        <Icon className={`mx-auto size-6 ${config.className}`} />
        <p className="body-sm font-semibold text-muted-foreground">{config.label}</p>
      </div>
    </div>
  );
}

export function SuccessMark() {
  return <CheckCircle2 className="size-4 text-success" />;
}
