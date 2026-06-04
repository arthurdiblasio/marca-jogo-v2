import { Shield } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ComponentState } from "@/types/design-system";
import { ComponentStateView } from "./component-state";

type TeamCardProps = {
  name: string;
  record: string;
  form: string[];
  state?: ComponentState;
};

export function TeamCard({ name, record, form, state = "success" }: TeamCardProps) {
  if (state !== "success") {
    return (
      <Card className="p-4">
        <ComponentStateView state={state} />
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <div className="flex items-center gap-4">
        <div className="grid size-16 place-items-center rounded-2xl bg-secondary text-secondary-foreground">
          <Shield className="size-8" />
        </div>
        <div>
          <p className="caption text-primary">Resumo competitivo</p>
          <h2 className="text-2xl font-black">{name}</h2>
          <p className="body-sm text-muted-foreground">{record}</p>
        </div>
      </div>
      <div className="mt-5 flex gap-2">
        {form.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className={cn(
              "grid size-9 place-items-center rounded-lg text-xs font-black",
              item === "V" && "bg-success text-white",
              item === "E" && "bg-warning text-white",
              item === "D" && "bg-danger text-white"
            )}
          >
            {item}
          </span>
        ))}
      </div>
    </Card>
  );
}
