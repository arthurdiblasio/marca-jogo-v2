import { EventScoreboard } from "@/components/football/event-scoreboard";
import { ParticipantList } from "@/components/football/participant-list";
import { SportSection } from "@/components/football/sport-section";
import { SportsRanking } from "@/components/football/sports-ranking";
import { StatStrip } from "@/components/football/stat-strip";
import { PageTransition } from "@/components/motion/page-transition";
import { PageHeader } from "@/components/navigation/page-header";
import { peladaRanking, peladaStats } from "@/constants/mock-data";

export default function PeladaHomePage() {
  return (
    <PageTransition className="space-y-4">
      <PageHeader
        eyebrow="Pelada da Resenha"
        title="Home da Pelada"
        description="Proxima rodada, confirmados, ranking e seus numeros em uma leitura rapida."
      />

      <EventScoreboard
        type="pelada"
        title="Proxima Pelada"
        home="Coletes"
        away="Sem Colete"
        date="Hoje, 20:30"
        venue="Arena Society Buritis"
        confirmed={18}
        capacity={22}
      />

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <SportSection title="Participantes Confirmados" action="18/22">
          <ParticipantList />
        </SportSection>

        <SportSection title="Ranking" action="Rodada atual">
          <SportsRanking items={peladaRanking} />
        </SportSection>
      </div>

      <SportSection title="Minhas Estatisticas">
        <StatStrip
          items={peladaStats.map((stat) => ({
            label: stat.label,
            value: stat.value,
            helper: stat.helper
          }))}
        />
      </SportSection>
    </PageTransition>
  );
}
