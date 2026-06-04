import { Check, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ComponentState } from "@/types/design-system";
import { ComponentStateView } from "./component-state";

type ConfirmationCardProps = {
  title: string;
  description: string;
  state?: ComponentState;
};

export function ConfirmationCard({ title, description, state = "success" }: ConfirmationCardProps) {
  if (state !== "success") {
    return (
      <Card className="p-4">
        <ComponentStateView state={state} />
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <h3 className="font-black">{title}</h3>
      <p className="body-sm mt-1 text-muted-foreground">{description}</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <Button variant="outline">
          <X className="size-4" />
          Recusar
        </Button>
        <Button>
          <Check className="size-4" />
          Confirmar
        </Button>
      </div>
    </Card>
  );
}
