import { redirect } from "next/navigation";
import Link from "next/link";
import { CalendarDays, MapPin, Trophy } from "lucide-react";

import { PageTransition } from "@/components/motion/page-transition";
import { PageHeader } from "@/components/navigation/page-header";
import { Card } from "@/components/ui/card";
import { ComponentStateView } from "@/components/cards/component-state";
import { PeladaProfileTabs } from "@/components/team/pelada-profile-tabs";
import { CreateEncontroForm } from "@/components/pelada/create-encontro-form";
import { requireAuth } from "@/shared/auth/require-auth";
import { getActiveOrgId } from "@/shared/orgs/active-org-cookie";
import { requireOrgMembership } from "@/shared/orgs/require-org-membership";
import { organizationRepository } from "@/modules/organizations/repositories/organization-repository";
import { peladaOccurrenceRepository } from "@/modules/pelada-occurrences/repositories/pelada-occurrence-repository";
import { computeNextPeladaDate } from "@/modules/organizations/lib/next-pelada";
import { formatListingDateTime } from "@/modules/game-listings/lib/format";
import { isVotingOpen } from "@/shared/voting/voting-window";

const MANAGER_ROLES = ["OWNER", "ADMIN", "CAPTAIN"];

export default async function PeladaEncontrosPage() {
  const session = await requireAuth();

  const activeOrgId = await getActiveOrgId();
  if (!activeOrgId) {
    redirect("/dashboard");
  }

  const [organization, membership, occurrences] = await Promise.all([
    organizationRepository.findById(activeOrgId),
    requireOrgMembership(session.id, activeOrgId),
    peladaOccurrenceRepository.listByOrganization(activeOrgId),
  ]);

  if (!organization) {
    redirect("/dashboard");
  }

  const isManager = MANAGER_ROLES.includes(membership.role);
  const nextDate = computeNextPeladaDate(organization.weekday, organization.scheduledTime);

  return (
    <PageTransition className="space-y-6">
      <PageHeader
        eyebrow="Pelada"
        title="Encontros"
        description="Gols, assistências, time vencedor e votação de melhor em campo de cada encontro."
      />

      <PeladaProfileTabs />

      {isManager && (
        <CreateEncontroForm
          organizationId={activeOrgId}
          defaultLocation={organization.address ?? ""}
          defaultDate={nextDate}
        />
      )}

      {occurrences.length === 0 ? (
        <ComponentStateView state="empty" emptyLabel="Nenhum encontro registrado ainda" />
      ) : (
        <div className="space-y-3">
          {occurrences.map((occurrence) => {
            const votingOpen = isVotingOpen(occurrence);
            return (
              <Link key={occurrence.id} href={`/pelada/encontros/${occurrence.id}`}>
                <Card className="flex items-center justify-between gap-3 p-4 transition hover:border-muted-foreground/40">
                  <div className="min-w-0">
                    <p className="font-bold text-foreground">{occurrence.title}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <CalendarDays className="size-4 shrink-0" />
                      <span className="capitalize">{formatListingDateTime(occurrence.scheduledAt)}</span>
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="size-4 shrink-0" />
                      {occurrence.location}
                    </p>
                  </div>
                  {votingOpen && (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-primary/15 px-3 py-1 text-xs font-bold text-primary">
                      <Trophy className="size-3.5" />
                      Votação aberta
                    </span>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </PageTransition>
  );
}
