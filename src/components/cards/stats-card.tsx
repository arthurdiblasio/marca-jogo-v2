import { Activity } from "lucide-react";

import { CardHover } from "@/components/motion/card-hover";
import { Card } from "@/components/ui/card";
import type { ComponentState } from "@/types/design-system";
import { ComponentStateView } from "./component-state";

type StatsCardProps = {
  label: string;
  value: string;
  helper: string;
  state?: ComponentState;
};

export function StatsCard({ label, value, helper, state = "success" }: StatsCardProps) {
  if (state !== "success") {
    return (
      <Card className="p-4">
        <ComponentStateView state={state} />
      </Card>
    );
  }

  return (
    <CardHover>
      <Card className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="caption text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-black">{value}</p>
            <p className="body-sm mt-1 text-muted-foreground">{helper}</p>
          </div>
          <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
            <Activity className="size-5" />
          </div>
        </div>
      </Card>
    </CardHover>
  );
}
