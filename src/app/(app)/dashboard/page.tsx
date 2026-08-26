import Link from "next/link";
import { CalendarDays, ClipboardList, MapPin, Megaphone, Search, Settings, Shield, Trophy, User, Users } from "lucide-react";

import { EventScoreboard } from "@/components/football/event-scoreboard";
import { ResultList, type MatchResultRow } from "@/components/football/result-list";
import { SportSection } from "@/components/football/sport-section";
import { SquadList } from "@/components/football/squad-list";
import { StatStrip } from "@/components/football/stat-strip";
import { PageTransition } from "@/components/motion/page-transition";
import { PageHeader } from "@/components/navigation/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ComponentStateView } from "@/components/cards/component-state";
import { EmptyOrgsState } from "@/components/organizations/empty-orgs-state";
import { PendingInviteModal } from "@/components/players/pending-invite-modal";
import { rankingRepository } from "@/modules/rankings/repositories/ranking-repository";
import { requireAuth } from "@/shared/auth/require-auth";
import { getActiveOrgId } from "@/shared/orgs/active-org-cookie";
import { organizationRepository } from "@/modules/organizations/repositories/organization-repository";
import { membershipRepository } from "@/modules/organizations/repositories/membership-repository";
import { matchRepository } from "@/modules/matches/repositories/match-repository";
import { playerInviteRepository } from "@/modules/player-invites/repositories/player-invite-repository";
import { getMatchPerspective } from "@/modules/matches/lib/format";
import { formatListingDateTime } from "@/modules/game-listings/lib/format";
import { gameListingRepository } from "@/modules/game-listings/repositories/game-listing-repository";
import { computeNextPeladaDate } from "@/modules/organizations/lib/next-pelada";
import { isManagerRole } from "@/shared/auth/manager-roles";
import { formatCurrency } from "@/lib/currency";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ invite?: string }>;
}) {
  const session = await requireAuth();
  const { invite: inviteToken } = await searchParams;

  const invite = inviteToken ? await playerInviteRepository.findByToken(inviteToken) : null;
  const pendingInvite =
    invite && invite.status === "PENDING" && invite.expiresAt > new Date()
      ? {
          token: inviteToken!,
          organizationName: invite.organization.name,
          organizationLogoUrl: invite.organization.logoUrl,
        }
      : null;

  const pendingInviteModal = pendingInvite ? (
    <PendingInviteModal
      token={pendingInvite.token}
      organizationName={pendingInvite.organizationName}
      organizationLogoUrl={pendingInvite.organizationLogoUrl}
    />
  ) : null;

  const orgs = await organizationRepository.findByUserId(session.id);

  if (orgs.length === 0) {
    return (
      <>
        {pendingInviteModal}
        <EmptyOrgsState />
      </>
    );
  }

  const activeOrgId = await getActiveOrgId();
  const activeOrg = activeOrgId ? await organizationRepository.findById(activeOrgId) : null;

  if (!activeOrgId || !activeOrg) {
    return (
      <PageTransition className="space-y-4">
        {pendingInviteModal}
        <PageHeader eyebrow="Home" title="Bem-vindo" description="Selecione uma organização para ver seu painel." />
      </PageTransition>
    );
  }

  if (activeOrg.type === "PELADA") {
    const members = await membershipRepository.listByOrganization(activeOrgId);
    const nextDate = computeNextPeladaDate(activeOrg.weekday, activeOrg.scheduledTime);
    const monthlyFee = formatCurrency(activeOrg.monthlyFee ? Number(activeOrg.monthlyFee) : null);
    const singleFee = formatCurrency(activeOrg.singleFee ? Number(activeOrg.singleFee) : null);

    return (
      <PageTransition className="space-y-4">
        {pendingInviteModal}

        <PageHeader
          eyebrow="Home"
          title={activeOrg.name}
          description="Próxima pelada, jogadores vinculados e configurações em um só lugar."
        />

        <div className="flex flex-wrap gap-3">
          <Button asChild size="sm" className="w-auto">
            <Link href="/pelada/encontros">
              <Trophy className="size-4" />
              Ver encontros
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="w-auto">
            <Link href="/pelada/jogadores">
              <Users className="size-4" />
              Ver jogadores
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="w-auto">
            <Link href="/pelada">
              <Settings className="size-4" />
              Configurar pelada
            </Link>
          </Button>
        </div>

        {nextDate ? (
          <Card className="space-y-3 p-5">
            <div className="flex items-center gap-3">
              <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10">
                <CalendarDays className="size-5 text-primary" />
              </div>
              <div>
                <p className="caption text-primary">Próxima pelada</p>
                <p className="font-black text-foreground">{formatListingDateTime(nextDate)}</p>
              </div>
            </div>

            {activeOrg.address && (
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4 shrink-0" />
                {activeOrg.address}
              </p>
            )}

            {(monthlyFee || singleFee) && (
              <p className="text-sm text-muted-foreground">
                Mensalista: {monthlyFee ?? "não definido"} · Avulso: {singleFee ?? "não definido"}
              </p>
            )}
          </Card>
        ) : (
          <Card className="p-5 text-sm text-muted-foreground">
            Nenhum dia e horário fixo cadastrado ainda. Configure em{" "}
            <Link href="/pelada" className="font-semibold text-primary">
              Configurar pelada
            </Link>
            .
          </Card>
        )}

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-black text-foreground">Jogadores vinculados</h2>
            <Link href="/pelada/jogadores" className="text-sm font-semibold text-primary">
              Ver todos
            </Link>
          </div>

          {members.length === 0 ? (
            <ComponentStateView state="empty" emptyLabel="Nenhum jogador vinculado ainda" />
          ) : (
            <div className="space-y-2">
              {members.slice(0, 5).map((member) => (
                <Card key={member.id} className="flex items-center gap-3 p-3">
                  <Avatar className="size-9 rounded-xl bg-primary/10">
                    {member.user.profile?.imageUrl && (
                      <AvatarImage
                        src={member.user.profile.imageUrl}
                        alt={member.user.profile?.nickname || member.user.profile?.fullName || member.user.email}
                      />
                    )}
                    <AvatarFallback className="rounded-xl bg-transparent">
                      <User className="size-4 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-bold text-foreground">
                    {member.user.profile?.nickname || member.user.profile?.fullName || member.user.email}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </section>
      </PageTransition>
    );
  }

  if (activeOrg.type !== "TEAM") {
    return (
      <PageTransition className="space-y-4">
        {pendingInviteModal}
        <PageHeader eyebrow="Home" title="Bem-vindo" description="Selecione uma organização para ver seu painel." />
      </PageTransition>
    );
  }

  const membership = await membershipRepository.findByUserAndOrganizations(session.id, [activeOrgId]);
  const isManager = isManagerRole(membership?.role);

  const [upcoming, past, pendingInterestsCount, teamStats, teamPlayers] = await Promise.all([
    matchRepository.listUpcomingByOrganization(activeOrgId, 1),
    matchRepository.listPastByOrganization(activeOrgId, 3),
    isManager ? gameListingRepository.countPendingResponses(activeOrgId) : Promise.resolve(0),
    rankingRepository.getTeamCollectiveStats(activeOrgId),
    rankingRepository.getTeamSquad(activeOrgId),
  ]);

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
      {pendingInviteModal}

      <PageHeader
        eyebrow="Home"
        title={activeOrg.name}
        description="Proximo jogo, forma recente, estatisticas coletivas e elenco em formato de match center."
      />

      {pendingInterestsCount > 0 && (
        <Card className="flex items-center justify-between gap-3 border-2 border-primary/20 bg-primary/10 p-4">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <Megaphone className="size-5 text-primary" />
            {pendingInterestsCount} {pendingInterestsCount > 1 ? "times querem jogar" : "time quer jogar"} com você
          </div>
          <Button asChild size="sm" className="w-auto">
            <Link href="/jogos/interesses">Ver e aceitar</Link>
          </Button>
        </Card>
      )}

      <div className="flex flex-wrap gap-3">
        {isManager && (
          <Button asChild size="sm" className="w-auto">
            <Link href="/jogos">
              <Search className="size-4" />
              Ver mural de jogos
            </Link>
          </Button>
        )}
        {isManager && (
          <Button asChild variant="outline" size="sm" className="w-auto">
            <Link href="/jogos/novo">
              <Megaphone className="size-4" />
              Publicar jogo
            </Link>
          </Button>
        )}
        <Button asChild variant={isManager ? "outline" : "default"} size="sm" className="w-auto">
          <Link href="/time/agenda">
            <CalendarDays className="size-4" />
            Ver agenda completa
          </Link>
        </Button>
        {isManager && (
          <Button asChild variant="outline" size="sm" className="w-auto">
            <Link href="/jogos/meus-jogos">
              <ClipboardList className="size-4" />
              Meus jogos publicados
            </Link>
          </Button>
        )}
        {isManager && (
          <Button asChild variant="outline" size="sm" className="w-auto">
            <Link href="/time/jogadores">
              <Users className="size-4" />
              Gerenciar elenco
            </Link>
          </Button>
        )}
        {isManager && (
          <Button asChild variant="outline" size="sm" className="w-auto">
            <Link href="/time">
              <Shield className="size-4" />
              Perfil do time
            </Link>
          </Button>
        )}
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
        <Card className="p-5 text-sm text-muted-foreground">
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
          <StatStrip items={teamStats} />
        </SportSection>
      </div>

      <SportSection title="Elenco" action={`${teamPlayers.length} atletas`}>
        <SquadList players={teamPlayers} />
      </SportSection>
    </PageTransition>
  );
}
