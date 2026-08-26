import { redirect } from "next/navigation";

import { PageTransition } from "@/components/motion/page-transition";
import { PageHeader } from "@/components/navigation/page-header";
import { SportSection } from "@/components/football/sport-section";
import { SportsRanking } from "@/components/football/sports-ranking";
import { StatStrip } from "@/components/football/stat-strip";
import { ComponentStateView } from "@/components/cards/component-state";
import { getActiveOrgId } from "@/shared/orgs/active-org-cookie";
import { rankingRepository } from "@/modules/rankings/repositories/ranking-repository";

export default async function TeamRankingPage() {
  const activeOrgId = await getActiveOrgId();
  if (!activeOrgId) {
    redirect("/dashboard");
  }

  const [ranking, stats] = await Promise.all([
    rankingRepository.getMatchPlayerRanking(activeOrgId),
    rankingRepository.getTeamCollectiveStats(activeOrgId),
  ]);

  return (
    <PageTransition className="space-y-4">
      <PageHeader
        eyebrow="Time"
        title="Ranking"
        description="Aproveitamento coletivo e avaliação média dos jogadores na temporada."
      />

      <SportSection title="Estatísticas do time">
        <StatStrip items={stats} />
      </SportSection>

      <SportSection title="Melhores avaliados" action={`${ranking.length} jogadores`}>
        {ranking.length > 0 ? (
          <SportsRanking items={ranking} />
        ) : (
          <ComponentStateView state="empty" emptyLabel="O ranking aparece após os jogos terem votação concluída" />
        )}
      </SportSection>
    </PageTransition>
  );
}
