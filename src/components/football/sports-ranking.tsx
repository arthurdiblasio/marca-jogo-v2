import { ArrowDown, ArrowUp, Minus, Trophy } from "lucide-react";

import type { RankingItem } from "@/types/design-system";

export function SportsRanking({ items }: { items: RankingItem[] }) {
  return (
    <div>
      {items.map((item, index) => {
        const Trend = item.trend === "up" ? ArrowUp : item.trend === "down" ? ArrowDown : Minus;
        return (
          <div key={item.name} className="sport-row grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 px-4 py-3">
            <div className="text-center text-lg font-black">
              {index === 0 ? <Trophy className="mx-auto size-5 text-accent" /> : index + 1}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-extrabold">{item.name}</p>
              <p className="caption text-muted-foreground">Rating</p>
            </div>
            <div className="flex items-center gap-2">
              <Trend className="size-4 text-primary" />
              <span className="text-2xl font-black">{item.score}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
