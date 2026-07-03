import { redirect } from "next/navigation";
import { User } from "lucide-react";

import { PageTransition } from "@/components/motion/page-transition";
import { PageHeader } from "@/components/navigation/page-header";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ComponentStateView } from "@/components/cards/component-state";
import { InvitePlayerSection } from "@/components/players/invite-player-section";
import { GuestPlayersSection } from "@/components/players/guest-players-section";
import { TeamProfileTabs } from "@/components/team/team-profile-tabs";
import { requireAuth } from "@/shared/auth/require-auth";
import { getActiveOrgId } from "@/shared/orgs/active-org-cookie";
import { requireOrgMembership } from "@/shared/orgs/require-org-membership";
import { membershipRepository } from "@/modules/organizations/repositories/membership-repository";
import { organizationRepository } from "@/modules/organizations/repositories/organization-repository";
import { playerInviteRepository } from "@/modules/player-invites/repositories/player-invite-repository";
import { guestPlayerRepository } from "@/modules/guest-players/repositories/guest-player-repository";

const ROLE_LABEL: Record<string, string> = {
  OWNER: "Dono",
  ADMIN: "Administrador",
  CAPTAIN: "Capitão",
  PLAYER: "Jogador",
};

const MANAGER_ROLES = ["OWNER", "ADMIN", "CAPTAIN"];

export default async function TeamPlayersPage() {
  const session = await requireAuth();

  const activeOrgId = await getActiveOrgId();
  if (!activeOrgId) {
    redirect("/dashboard");
  }

  const membership = await requireOrgMembership(session.id, activeOrgId);
  const isManager = MANAGER_ROLES.includes(membership.role);

  const [organization, members, pendingInvites, guests] = await Promise.all([
    organizationRepository.findById(activeOrgId),
    membershipRepository.listByOrganization(activeOrgId),
    isManager ? playerInviteRepository.listActiveByOrganization(activeOrgId) : Promise.resolve([]),
    guestPlayerRepository.listByOrganization(activeOrgId),
  ]);

  const teamModality = organization?.modality;

  return (
    <PageTransition className="space-y-6">
      <PageHeader
        eyebrow="Time"
        title="Elenco"
        description="Jogadores vinculados ao seu time e convites para novos jogadores."
      />

      <TeamProfileTabs />

      {isManager && <InvitePlayerSection pendingInvites={pendingInvites} />}

      <section className="space-y-3">
        <h2 className="text-lg font-black text-slate-900">Elenco atual</h2>
        {members.length === 0 ? (
          <ComponentStateView state="empty" emptyLabel="Nenhum jogador vinculado ainda" />
        ) : (
          <div className="space-y-3">
            {members.map((member) => {
              const positions = teamModality
                ? member.user.profile?.modalityPositions.find((mp) => mp.modality === teamModality)
                    ?.positions ?? []
                : [];
              const positionLabel = positions.length > 0 ? positions.join(", ") : "Não selecionou nenhuma";

              return (
                <Card key={member.id} className="flex items-center justify-between gap-3 p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 rounded-xl bg-green-50">
                      {member.user.profile?.imageUrl && (
                        <AvatarImage
                          src={member.user.profile.imageUrl}
                          alt={member.user.profile?.nickname || member.user.profile?.fullName || member.user.email}
                        />
                      )}
                      <AvatarFallback className="rounded-xl bg-transparent">
                        <User className="size-5 text-primary" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-slate-900">
                        {member.user.profile?.nickname || member.user.profile?.fullName || member.user.email}
                      </p>
                      {member.user.profile?.nickname && (
                        <p className="text-sm text-slate-500">{member.user.profile.fullName}</p>
                      )}
                      {teamModality && <p className="text-sm text-slate-500">{positionLabel}</p>}
                    </div>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                    {ROLE_LABEL[member.role] ?? member.role}
                  </span>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      <GuestPlayersSection
        organizationId={activeOrgId}
        guests={guests}
        members={members.map((m) => ({
          userId: m.userId,
          name: m.user.profile?.nickname || m.user.profile?.fullName || m.user.email,
          imageUrl: m.user.profile?.imageUrl ?? null,
          hasMergedGuest: m.hasMergedGuest,
        }))}
        isManager={isManager}
      />
    </PageTransition>
  );
}
