import Link from "next/link";
import { redirect } from "next/navigation";

import { PageTransition } from "@/components/motion/page-transition";
import { PageHeader } from "@/components/navigation/page-header";
import { PendingInterestsList } from "@/components/game-listings/pending-interests-list";
import { requireAuth } from "@/shared/auth/require-auth";
import { getActiveOrgId } from "@/shared/orgs/active-org-cookie";
import { gameListingRepository } from "@/modules/game-listings/repositories/game-listing-repository";

export default async function PendingInterestsPage() {
  await requireAuth();

  const activeOrgId = await getActiveOrgId();
  if (!activeOrgId) {
    redirect("/dashboard");
  }

  const responses = await gameListingRepository.listPendingResponsesByOrganization(activeOrgId);

  return (
    <PageTransition className="space-y-6">
      <PageHeader
        eyebrow="Mural de Jogos"
        title="Interesses pendentes"
        description="Times que demonstraram interesse nos jogos que você anunciou, prontos para aceitar."
      />

      <PendingInterestsList responses={responses} />

      <Link href="/jogos/meus-jogos" className="inline-block text-sm font-semibold text-primary">
        ← Ver meus jogos publicados
      </Link>
    </PageTransition>
  );
}
