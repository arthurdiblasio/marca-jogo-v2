import Link from "next/link";
import { redirect } from "next/navigation";
import { Shield } from "lucide-react";

import { PageTransition } from "@/components/motion/page-transition";
import { PageHeader } from "@/components/navigation/page-header";
import { Card } from "@/components/ui/card";
import { ComponentStateView } from "@/components/cards/component-state";
import { InvitePlayerSection } from "@/components/players/invite-player-section";
import { requireAuth } from "@/shared/auth/require-auth";
import { getActiveOrgId } from "@/shared/orgs/active-org-cookie";
import { requireOrgMembership } from "@/shared/orgs/require-org-membership";
import { membershipRepository } from "@/modules/organizations/repositories/membership-repository";
import { playerInviteRepository } from "@/modules/player-invites/repositories/player-invite-repository";

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

  const [members, pendingInvites] = await Promise.all([
    membershipRepository.listByOrganization(activeOrgId),
    isManager ? playerInviteRepository.listActiveByOrganization(activeOrgId) : Promise.resolve([]),
  ]);

  return (
    <PageTransition className="space-y-6">
      <PageHeader
        eyebrow="Time"
        title="Elenco"
        description="Jogadores vinculados ao seu time e convites para novos jogadores."
      />

      {isManager && <InvitePlayerSection pendingInvites={pendingInvites} />}

      <section className="space-y-3">
        <h2 className="text-lg font-black text-slate-900">Elenco atual</h2>
        {members.length === 0 ? (
          <ComponentStateView state="empty" emptyLabel="Nenhum jogador vinculado ainda" />
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <Card key={member.id} className="flex items-center justify-between gap-3 p-4">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-green-50">
                    <Shield className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">
                      {member.user.profile?.nickname || member.user.profile?.fullName || member.user.email}
                    </p>
                    {member.user.profile?.nickname && (
                      <p className="text-sm text-slate-500">{member.user.profile.fullName}</p>
                    )}
                  </div>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                  {ROLE_LABEL[member.role] ?? member.role}
                </span>
              </Card>
            ))}
          </div>
        )}
      </section>

      <Link href="/time" className="inline-block text-sm font-semibold text-primary">
        ← Voltar para o time
      </Link>
    </PageTransition>
  );
}
