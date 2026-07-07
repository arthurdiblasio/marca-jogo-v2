import { redirect } from "next/navigation";
import { User } from "lucide-react";

import { PageTransition } from "@/components/motion/page-transition";
import { PageHeader } from "@/components/navigation/page-header";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ComponentStateView } from "@/components/cards/component-state";
import { InvitePlayerSection } from "@/components/players/invite-player-section";
import { PlayerContactActions } from "@/components/players/player-contact-actions";
import { GuestPlayersSection } from "@/components/players/guest-players-section";
import { PeladaProfileTabs } from "@/components/team/pelada-profile-tabs";
import { MonthlyToggle } from "@/components/team/monthly-toggle";
import { requireAuth } from "@/shared/auth/require-auth";
import { getActiveOrgId } from "@/shared/orgs/active-org-cookie";
import { requireOrgMembership } from "@/shared/orgs/require-org-membership";
import { membershipRepository } from "@/modules/organizations/repositories/membership-repository";
import { playerInviteRepository } from "@/modules/player-invites/repositories/player-invite-repository";
import { guestPlayerRepository } from "@/modules/guest-players/repositories/guest-player-repository";

const ROLE_LABEL: Record<string, string> = {
  OWNER: "Dono",
  ADMIN: "Administrador",
  CAPTAIN: "Capitão",
  PLAYER: "Jogador",
};

const MANAGER_ROLES = ["OWNER", "ADMIN", "CAPTAIN"];

export default async function PeladaPlayersPage() {
  const session = await requireAuth();

  const activeOrgId = await getActiveOrgId();
  if (!activeOrgId) {
    redirect("/dashboard");
  }

  const membership = await requireOrgMembership(session.id, activeOrgId);
  const isManager = MANAGER_ROLES.includes(membership.role);

  const [members, pendingInvites, guests] = await Promise.all([
    membershipRepository.listByOrganization(activeOrgId),
    isManager ? playerInviteRepository.listActiveByOrganization(activeOrgId) : Promise.resolve([]),
    guestPlayerRepository.listByOrganization(activeOrgId),
  ]);

  return (
    <PageTransition className="space-y-6">
      <PageHeader
        eyebrow="Pelada"
        title="Jogadores"
        description="Jogadores vinculados à sua pelada e convites para novos jogadores."
      />

      <PeladaProfileTabs />

      {isManager && <InvitePlayerSection pendingInvites={pendingInvites} />}

      <section className="space-y-3">
        <h2 className="text-lg font-black text-foreground">Jogadores da pelada</h2>
        {members.length === 0 ? (
          <ComponentStateView state="empty" emptyLabel="Nenhum jogador vinculado ainda" />
        ) : (
          <div className="space-y-3">
            {members.map((member) => {
              const name = member.user.profile?.nickname || member.user.profile?.fullName || member.user.email;

              return (
                <Card key={member.id} className="flex flex-col gap-3 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-10 rounded-xl bg-primary/10">
                        {member.user.profile?.imageUrl && (
                          <AvatarImage src={member.user.profile.imageUrl} alt={name} />
                        )}
                        <AvatarFallback className="rounded-xl bg-transparent">
                          <User className="size-5 text-primary" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-bold text-foreground">{name}</p>
                        {member.user.profile?.nickname && (
                          <p className="text-sm text-muted-foreground">{member.user.profile.fullName}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MonthlyToggle membershipId={member.id} isMonthly={member.isMonthly} editable={isManager} />
                      <span className="rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
                        {ROLE_LABEL[member.role] ?? member.role}
                      </span>
                    </div>
                  </div>
                  {member.user.profile?.phone && (
                    <div className="flex justify-end">
                      <PlayerContactActions phone={member.user.profile.phone} name={name} />
                    </div>
                  )}
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
