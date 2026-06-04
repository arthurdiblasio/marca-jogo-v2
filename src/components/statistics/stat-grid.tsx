import { StatsCard } from "@/components/cards/stats-card";

type StatGridProps = {
  items: Array<{ label: string; value: string; helper: string }>;
};

export function StatGrid({ items }: StatGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <StatsCard key={item.label} {...item} />
      ))}
    </div>
  );
}
