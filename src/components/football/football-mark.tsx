import { Logo } from "@/components/brand/logo";
import { cn } from "@/lib/utils";

export function FootballMark({ className }: { className?: string }) {
  return <Logo className={cn("h-8 w-auto", className)} />;
}
