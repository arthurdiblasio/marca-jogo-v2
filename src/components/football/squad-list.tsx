import { Shirt } from "lucide-react";

import type { Player } from "@/types/design-system";

export function SquadList({ players }: { players: Player[] }) {
  return (
    <div>
      {players.map((player) => (
        <div key={player.name} className="sport-row grid grid-cols-[2.5rem_1fr_auto_auto] items-center gap-3 px-4 py-3">
          <div className="grid size-9 place-items-center rounded-md bg-muted">
            <Shirt className="size-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold">{player.name}</p>
            <p className="caption text-muted-foreground">{player.position}</p>
          </div>
          <span className="text-lg font-black">#{player.number}</span>
          <span className="rounded bg-primary/10 px-2 py-1 text-sm font-black text-primary">
            {player.rating}
          </span>
        </div>
      ))}
    </div>
  );
}
