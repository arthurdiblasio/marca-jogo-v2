import Link from "next/link";
import { Shield, Swords, Users } from "lucide-react";

import { CardHover } from "@/components/motion/card-hover";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ComponentState, Organization } from "@/types/design-system";
import { ComponentStateView } from "./component-state";

type OrganizationCardProps = {
  organization: Organization;
  state?: ComponentState;
};

export function OrganizationCard({ organization, state = "success" }: OrganizationCardProps) {
  const Icon = organization.type === "pelada" ? Swords : Shield;
  const href = organization.type === "pelada" ? "/pelada" : "/time";

  if (state !== "success") {
    return (
      <Card className="p-4">
        <ComponentStateView state={state} />
      </Card>
    );
  }

  return (
    <CardHover>
      <Link href={href}>
        <Card
          className={cn(
            "relative min-h-72 overflow-hidden p-5 text-white",
            "bg-gradient-to-br",
            organization.accent
          )}
        >
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/45 to-transparent" />
          <div className="relative z-10 flex h-full min-h-60 flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="grid size-12 place-items-center rounded-xl bg-white/18 backdrop-blur">
                <Icon className="size-6" />
              </div>
              <span className="rounded-full bg-white/18 px-3 py-1 text-xs font-bold backdrop-blur">
                {organization.type === "pelada" ? "Pelada" : "Time"}
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black">{organization.name}</h2>
              <div className="mt-3 flex flex-wrap gap-2 text-sm font-bold text-white/90">
                <span className="inline-flex items-center gap-1 rounded-full bg-black/20 px-3 py-1">
                  <Users className="size-4" />
                  {organization.members} membros
                </span>
                <span className="rounded-full bg-black/20 px-3 py-1">{organization.nextEvent}</span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </CardHover>
  );
}
