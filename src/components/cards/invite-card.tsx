import { Share2, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ComponentState } from "@/types/design-system";
import { ComponentStateView } from "./component-state";

type InviteCardProps = {
  title?: string;
  description?: string;
  state?: ComponentState;
};

export function InviteCard({
  title = "Convide a resenha",
  description = "Compartilhe o convite com quem vai fortalecer o jogo.",
  state = "success"
}: InviteCardProps) {
  if (state !== "success") {
    return (
      <Card className="p-4">
        <ComponentStateView state={state} />
      </Card>
    );
  }

  return (
    <Card className="p-5">
      <div className="flex items-start gap-4">
        <div className="grid size-12 place-items-center rounded-xl bg-accent text-accent-foreground">
          <UserPlus className="size-6" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-black">{title}</h3>
          <p className="body-sm mt-1 text-muted-foreground">{description}</p>
          <Button className="mt-4" size="sm" variant="secondary">
            <Share2 className="size-4" />
            Compartilhar
          </Button>
        </div>
      </div>
    </Card>
  );
}
