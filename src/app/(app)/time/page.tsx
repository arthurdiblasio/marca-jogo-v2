import Link from "next/link";
import { Megaphone, Search } from "lucide-react";

import { EventScoreboard } from "@/components/football/event-scoreboard";
import { ResultList } from "@/components/football/result-list";
import { SportSection } from "@/components/football/sport-section";
import { SquadList } from "@/components/football/squad-list";
import { StatStrip } from "@/components/football/stat-strip";
import { PageTransition } from "@/components/motion/page-transition";
import { PageHeader } from "@/components/navigation/page-header";
import { Button } from "@/components/ui/button";
import { teamPlayers, teamStats } from "@/constants/mock-data";

export default function TeamHomePage() {
  return (
    <PageTransition className="space-y-4">
      <PageHeader
        eyebrow="Real Ibirite"
        title="Home do Time"
        description="Proximo jogo, forma recente, estatisticas coletivas e elenco em formato de match center."
      />

      <div className="flex flex-wrap gap-3">
        <Button asChild size="sm" className="w-auto">
          <Link href="/jogos">
            <Search className="size-4" />
            Ver mural de jogos
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="w-auto">
          <Link href="/jogos/novo">
            <Megaphone className="size-4" />
            Publicar jogo
          </Link>
        </Button>
      </div>

      <EventScoreboard
        type="time"
        title="Proximo Jogo"
        home="Real Ibirite"
        away="Atletico Master"
        date="Domingo, 09:00"
        venue="Campo do Santa Rita"
        confirmed={16}
        capacity={18}
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <SportSection title="Ultimos Resultados" action="Forma: V E V">
          <ResultList />
        </SportSection>

        <SportSection title="Estatisticas do Time">
          <StatStrip
            items={teamStats.map((stat) => ({
              label: stat.label,
              value: stat.value,
              helper: stat.helper
            }))}
          />
        </SportSection>
      </div>

      <SportSection title="Elenco" action={`${teamPlayers.length} atletas`}>
        <SquadList players={teamPlayers} />
      </SportSection>
    </PageTransition>
  );
}
