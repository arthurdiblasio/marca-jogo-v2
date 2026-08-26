import { redirect } from "next/navigation";

import { PageTransition } from "@/components/motion/page-transition";
import { PageHeader } from "@/components/navigation/page-header";
import { SportSection } from "@/components/football/sport-section";
import { SportsRanking } from "@/components/football/sports-ranking";
import { StatStrip } from "@/components/football/stat-strip";
import { ComponentStateView } from "@/components/cards/component-state";
import { getActiveOrgId } from "@/shared/orgs/active-org-cookie";
import { rankingRepository } from "@/modules/rankings/repositories/ranking-repository";

export default async function PeladaRankingPage() {
  const activeOrgId = await getActiveOrgId();
  if (!activeOrgId) {
    redirect("/dashboard");
  }

  const [ranking, stats] = await Promise.all([
    rankingRepository.getPeladaPlayerRanking(activeOrgId),
    rankingRepository.getPeladaCollectiveStats(activeOrgId),
  ]);

  return (
    <PageTransition className="space-y-4">
      <PageHeader
        eyebrow="Pelada"
        title="Ranking"
        description="Avaliação média dos jogadores e estatísticas coletivas da temporada."
      />

      <SportSection title="Estatísticas do grupo">
        <StatStrip items={stats} />
      </SportSection>

      <SportSection title="Melhores avaliados" action={`${ranking.length} jogadores`}>
        {ranking.length > 0 ? (
          <SportsRanking items={ranking} />
        ) : (
          <ComponentStateView state="empty" emptyLabel="O ranking aparece após os encontros terem votação concluída" />
        )}
      </SportSection>
    </PageTransition>
  );
}
