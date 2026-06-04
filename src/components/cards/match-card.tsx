import { CalendarDays, MapPin, Swords } from "lucide-react";

import { CardHover } from "@/components/motion/card-hover";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { ComponentState } from "@/types/design-system";
import { AvatarGroup } from "./avatar-group";
import { ComponentStateView } from "./component-state";
import { StatBadge } from "./stat-badge";

type MatchCardProps = {
  title: string;
  opponent: string;
  date: string;
  venue: string;
  state?: ComponentState;
  status?: ComponentState;
};

export function MatchCard({ title, opponent, date, venue, state = "success" }: MatchCardProps) {
  if (state !== "success") {
    return (
      <Card className="p-4">
        <ComponentStateView state={state} />
      </Card>
    );
  }

  return (
    <CardHover>
      <Card className="overflow-hidden">
        <CardHeader className="bg-secondary text-secondary-foreground">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="caption text-accent">{title}</p>
              <h2 className="mt-2 text-2xl font-black">{opponent}</h2>
            </div>
            <div className="grid size-12 place-items-center rounded-xl bg-white/10">
              <Swords className="size-6" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
              <CalendarDays className="size-5 text-primary" />
              <span className="font-bold">{date}</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
              <MapPin className="size-5 text-primary" />
              <span className="font-bold">{venue}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <AvatarGroup names={["Bruno", "Rafa", "Caio", "Nando"]} />
            <div className="flex gap-2">
              <StatBadge trend="up" label="Confirmacoes abertas" />
              <Button size="sm">Ver detalhes</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </CardHover>
  );
}
