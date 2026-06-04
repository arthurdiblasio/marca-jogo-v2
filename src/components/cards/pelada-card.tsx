import { Clock, MapPin, Swords } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { ComponentState } from "@/types/design-system";
import { ComponentStateView } from "./component-state";

type PeladaCardProps = {
  name: string;
  time: string;
  venue: string;
  state?: ComponentState;
};

export function PeladaCard({ name, time, venue, state = "success" }: PeladaCardProps) {
  if (state !== "success") {
    return (
      <Card className="p-4">
        <ComponentStateView state={state} />
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <div className="grid size-12 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Swords className="size-6" />
        </div>
        <div>
          <h3 className="font-black">{name}</h3>
          <div className="body-sm mt-1 flex flex-wrap gap-3 text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="size-4" />
              {time}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-4" />
              {venue}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
