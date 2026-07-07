import { CalendarDays, MapPin, Shield, Swords } from "lucide-react";

import { cn } from "@/lib/utils";

type EventScoreboardProps = {
  type: "pelada" | "time";
  title: string;
  date: string;
  venue: string;
  home?: string;
  away?: string;
  confirmed?: number;
  capacity?: number;
};

export function EventScoreboard({
  type,
  title,
  date,
  venue,
  home = "Time Verde",
  away = "Time Preto",
  confirmed = 18,
  capacity = 22
}: EventScoreboardProps) {
  const Icon = type === "pelada" ? Swords : Shield;

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-card">
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="caption text-primary">{title}</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="size-4" />
                {date}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-4" />
                {venue}
              </span>
            </div>
          </div>
          <div className="grid size-10 place-items-center rounded-md bg-muted text-muted-foreground">
            <Icon className="size-5" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-6">
        <TeamLabel name={home} align="right" />
        <div className="text-center">
          <div className="text-4xl font-black leading-none tracking-normal text-foreground">VS</div>
          <div className="mt-2 rounded bg-primary px-2 py-1 text-[0.65rem] font-black uppercase text-primary-foreground">
            {confirmed}/{capacity} confirmados
          </div>
        </div>
        <TeamLabel name={away} />
      </div>

      <div className="h-1 bg-muted">
        <div
          className="h-full bg-primary"
          style={{ width: `${Math.min((confirmed / capacity) * 100, 100)}%` }}
        />
      </div>
    </section>
  );
}

function TeamLabel({ name, align }: { name: string; align?: "right" }) {
  return (
    <div className={cn("min-w-0", align === "right" && "text-right")}>
      <div className="mx-auto mb-2 grid size-11 place-items-center rounded-md bg-muted text-muted-foreground">
        <Shield className="size-6" />
      </div>
      <p className="truncate text-sm font-black text-foreground sm:text-base">{name}</p>
    </div>
  );
}
