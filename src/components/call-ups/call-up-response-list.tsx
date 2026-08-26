"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X, CalendarDays } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { respondCallUpAction } from "@/modules/call-ups/actions/respond-call-up";

export type CallUpResponseItem = {
  id: string;
  title: string;
  subtitle: string;
};

export function CallUpResponseList({ items }: { items: CallUpResponseItem[] }) {
  const router = useRouter();

  async function respond(item: CallUpResponseItem, status: "ACCEPTED" | "DECLINED") {
    try {
      await respondCallUpAction({ id: item.id, status });
      toast.success(status === "ACCEPTED" ? "Presença confirmada!" : "Convocação recusada.");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao responder convocação");
    }
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <Card key={item.id} className="flex items-center gap-3 p-4">
          <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10">
            <CalendarDays className="size-5 text-primary" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate font-bold text-foreground">{item.title}</p>
            <p className="caption capitalize text-muted-foreground">{item.subtitle}</p>
          </div>

          <div className="flex shrink-0 gap-2">
            <Button size="icon" variant="outline" onClick={() => respond(item, "DECLINED")} aria-label="Recusar">
              <X className="size-4" />
            </Button>
            <Button size="icon" onClick={() => respond(item, "ACCEPTED")} aria-label="Aceitar">
              <Check className="size-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
