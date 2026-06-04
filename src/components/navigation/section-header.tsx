import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
};

export function SectionHeader({ title, actionLabel }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h2 className="heading-md">{title}</h2>
      {actionLabel ? (
        <Button variant="ghost" size="sm">
          {actionLabel}
          <ArrowRight className="size-4" />
        </Button>
      ) : null}
    </div>
  );
}
