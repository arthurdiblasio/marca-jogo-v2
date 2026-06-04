import Link from "next/link";
import { ChevronRight, Shield, Swords, Users } from "lucide-react";

import type { Organization } from "@/types/design-system";

export function OrganizationLeagueList({ organizations }: { organizations: Organization[] }) {
  return (
    <section className="sport-section overflow-hidden rounded-lg">
      <div className="grid grid-cols-[1fr_auto] border-b px-4 py-3">
        <h2 className="text-[0.8rem] font-black uppercase">Minhas organizacoes</h2>
        <span className="text-xs font-black text-primary">{organizations.length} ativas</span>
      </div>
      {organizations.map((organization) => {
        const Icon = organization.type === "pelada" ? Swords : Shield;
        const href = organization.type === "pelada" ? "/pelada" : "/time";

        return (
          <Link
            key={organization.id}
            href={href}
            className="sport-row grid grid-cols-[2.75rem_1fr_auto] items-center gap-3 px-4 py-4 transition hover:bg-muted/70"
          >
            <div className="grid size-11 place-items-center rounded-md bg-secondary text-secondary-foreground">
              <Icon className="size-5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-black">{organization.name}</p>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs font-extrabold text-muted-foreground">
                <span>{organization.type === "pelada" ? "Pelada" : "Time"}</span>
                <span className="inline-flex items-center gap-1">
                  <Users className="size-3.5" />
                  {organization.members}
                </span>
                <span>{organization.nextEvent}</span>
              </div>
            </div>
            <ChevronRight className="size-5 text-muted-foreground" />
          </Link>
        );
      })}
    </section>
  );
}
