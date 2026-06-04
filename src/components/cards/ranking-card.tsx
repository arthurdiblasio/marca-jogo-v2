import { Trophy } from "lucide-react";

import { Card } from "@/components/ui/card";
import type { ComponentState, RankingItem } from "@/types/design-system";
import { ComponentStateView } from "./component-state";
import { StatBadge } from "./stat-badge";

type RankingCardProps = {
  items: RankingItem[];
  state?: ComponentState;
};

export function RankingCard({ items, state = "success" }: RankingCardProps) {
  if (state !== "success") {
    return (
      <Card className="p-4">
        <ComponentStateView state={state} />
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {items.map((item, index) => (
        <div key={item.name} className="flex items-center gap-4 border-b p-4 last:border-b-0">
          <div className="grid size-10 place-items-center rounded-lg bg-muted font-black">
            {index === 0 ? <Trophy className="size-5 text-accent" /> : index + 1}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-bold">{item.name}</p>
            <p className="caption text-muted-foreground">Nota da rodada</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-black">{item.score}</p>
            <StatBadge trend={item.trend} label={item.trend === "up" ? "Subiu" : item.trend === "down" ? "Caiu" : "Estavel"} />
          </div>
        </div>
      ))}
    </Card>
  );
}
