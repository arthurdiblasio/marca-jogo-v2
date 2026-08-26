import { redirect } from "next/navigation";

import { PageTransition } from "@/components/motion/page-transition";
import { PageHeader } from "@/components/navigation/page-header";
import { ComponentStateView } from "@/components/cards/component-state";
import { CallUpResponseList, type CallUpResponseItem } from "@/components/call-ups/call-up-response-list";
import { requireAuth } from "@/shared/auth/require-auth";
import { getActiveOrgId } from "@/shared/orgs/active-org-cookie";
import { callUpRepository } from "@/modules/call-ups/repositories/call-up-repository";
import { formatListingDateTime } from "@/modules/game-listings/lib/format";

export default async function ConvocacoesPage() {
  const session = await requireAuth();

  const activeOrgId = await getActiveOrgId();
  if (!activeOrgId) {
    redirect("/dashboard");
  }

  const matchCallUps = await callUpRepository.listPendingForUserInOrg(session.id, activeOrgId);

  const items: CallUpResponseItem[] = matchCallUps.map((callUp) => {
    const isHome = callUp.match.homeOrganizationId === activeOrgId;
    const opponent = isHome ? callUp.match.awayOrganization?.name : callUp.match.homeOrganization.name;
    return {
      id: callUp.id,
      title: `vs ${opponent ?? callUp.match.opponentName ?? "Adversário"}`,
      subtitle: formatListingDateTime(callUp.match.scheduledAt),
    };
  });

  return (
    <PageTransition className="space-y-4">
      <PageHeader
        eyebrow="Convocações"
        title="Suas convocações"
        description="Confirme ou recuse sua presença nos jogos para os quais você foi convocado nesta organização."
      />

      {items.length === 0 ? (
        <ComponentStateView state="empty" emptyLabel="Nenhuma convocação pendente" />
      ) : (
        <CallUpResponseList items={items} />
      )}
    </PageTransition>
  );
}
