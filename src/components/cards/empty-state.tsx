import { Plus, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
};

export function EmptyState({ title, description, actionLabel }: EmptyStateProps) {
  return (
    <Card className="grid min-h-64 place-items-center p-8 text-center">
      <div className="max-w-sm">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <Sparkles className="size-7" />
        </div>
        <h3 className="heading-md mt-4">{title}</h3>
        <p className="body-sm mt-2 text-muted-foreground">{description}</p>
        {actionLabel ? (
          <Button className="mt-5">
            <Plus className="size-4" />
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </Card>
  );
}
