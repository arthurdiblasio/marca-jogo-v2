import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { ComponentState } from "@/types/design-system";
import { ComponentStateView } from "./component-state";

type MetricCardProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  state?: ComponentState;
};

export function MetricCard({ label, value, icon: Icon, state = "success" }: MetricCardProps) {
  if (state !== "success") {
    return (
      <Card className="p-4">
        <ComponentStateView state={state} />
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="caption text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-black">{value}</p>
        </div>
        <div className="grid size-10 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
      </div>
    </Card>
  );
}
