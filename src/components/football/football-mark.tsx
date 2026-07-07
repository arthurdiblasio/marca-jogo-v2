import { Goal, Swords } from "lucide-react";

import { cn } from "@/lib/utils";

export function FootballMark({ className }: { className?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-2 font-black", className)}>
      <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
        <Swords className="size-5" />
      </span>
      <span>Chama Time</span>
      <Goal className="size-4 text-accent" />
    </div>
  );
}
