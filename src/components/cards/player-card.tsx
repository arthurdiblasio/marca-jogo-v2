import { Shirt } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { ComponentState, Player } from "@/types/design-system";
import { ComponentStateView } from "./component-state";

type PlayerCardProps = {
  player: Player;
  state?: ComponentState;
};

export function PlayerCard({ player, state = "success" }: PlayerCardProps) {
  if (state !== "success") {
    return (
      <Card className="p-4">
        <ComponentStateView state={state} />
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div className="grid size-14 place-items-center rounded-xl bg-primary/10 text-primary">
          <Shirt className="size-6" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold">{player.name}</p>
          <p className="caption text-muted-foreground">
            #{player.number} · {player.position}
          </p>
        </div>
        <div className="rounded-lg bg-muted px-2.5 py-1 text-sm font-black">{player.rating}</div>
      </div>
    </Card>
  );
}
