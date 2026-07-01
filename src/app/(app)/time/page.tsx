import Link from "next/link";
import { CalendarDays, ClipboardList, Megaphone, Search, Users } from "lucide-react";

import { EventScoreboard } from "@/components/football/event-scoreboard";
import { ResultList, type MatchResultRow } from "@/components/football/result-list";
import { SportSection } from "@/components/football/sport-section";
import { SquadList } from "@/components/football/squad-list";
import { StatStrip } from "@/components/football/stat-strip";
import { PageTransition } from "@/components/motion/page-transition";
import { PageHeader } from "@/components/navigation/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { teamPlayers, teamStats } from "@/constants/mock-data";
import { requireAuth } from "@/shared/auth/require-auth";
import { getActiveOrgId } from "@/shared/orgs/active-org-cookie";
import { matchRepository } from "@/modules/matches/repositories/match-repository";
import { getMatchPerspective } from "@/modules/matches/lib/format";
import { formatListingDateTime } from "@/modules/game-listings/lib/format";

export default async function TeamHomePage() {
  await requireAuth();
  const activeOrgId = await getActiveOrgId();

  const [upcoming, past] = activeOrgId
    ? await Promise.all([
        matchRepository.listUpcomingByOrganization(activeOrgId, 1),
        matchRepository.listPastByOrganization(activeOrgId, 3),
      ])
    : [[], []];

  const nextMatch = upcoming[0];
  const nextMatchPerspective = nextMatch ? getMatchPerspective(nextMatch, activeOrgId) : null;

  const results: MatchResultRow[] = past
    .map((match) => {
      const perspective = getMatchPerspective(match, activeOrgId);
      if (!perspective.outcome || perspective.teamScore == null || perspective.opponentScore == null) return null;
      return {
        id: match.id,
        home: perspective.isHome ? "Seu time" : perspective.opponentLabel,
        away: perspective.isHome ? perspective.opponentLabel : "Seu time",
        score: perspective.isHome
          ? `${perspective.teamScore}-${perspective.opponentScore}`
          : `${perspective.opponentScore}-${perspective.teamScore}`,
        status: perspective.outcome,
      };
    })
    .filter((row): row is MatchResultRow => row !== null);

  return (
    <PageTransition className="space-y-4">
      <PageHeader
        eyebrow="Time"
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
        <Button asChild variant="outline" size="sm" className="w-auto">
          <Link href="/time/agenda">
            <CalendarDays className="size-4" />
            Ver agenda completa
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="w-auto">
          <Link href="/jogos/meus-jogos">
            <ClipboardList className="size-4" />
            Meus jogos publicados
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="w-auto">
          <Link href="/time/jogadores">
            <Users className="size-4" />
            Gerenciar elenco
          </Link>
        </Button>
      </div>

      {nextMatch && nextMatchPerspective ? (
        <EventScoreboard
          type="time"
          title="Proximo Jogo"
          home={nextMatchPerspective.isHome ? "Seu time" : nextMatchPerspective.opponentLabel}
          away={nextMatchPerspective.isHome ? nextMatchPerspective.opponentLabel : "Seu time"}
          date={formatListingDateTime(nextMatch.scheduledAt)}
          venue={nextMatch.location}
        />
      ) : (
        <Card className="p-5 text-sm text-slate-400">
          Nenhum jogo agendado. Publique ou responda a um anuncio no{" "}
          <Link href="/jogos" className="font-semibold text-primary">
            mural de jogos
          </Link>
          .
        </Card>
      )}

      <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
        <SportSection title="Ultimos Resultados">
          <ResultList results={results} />
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
