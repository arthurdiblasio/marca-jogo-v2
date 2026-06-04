import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";

import { cn } from "@/lib/utils";

type StatBadgeProps = {
  trend?: "up" | "down" | "stable";
  label: string;
};

export function StatBadge({ trend = "stable", label }: StatBadgeProps) {
  const Icon = trend === "up" ? ArrowUp : trend === "down" ? ArrowDown : ArrowRight;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold",
        trend === "up" && "bg-success/10 text-success",
        trend === "down" && "bg-danger/10 text-danger",
        trend === "stable" && "bg-muted text-muted-foreground"
      )}
    >
      <Icon className="size-3.5" />
      {label}
    </span>
  );
}
