import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";

import { PageTransition } from "@/components/motion/page-transition";
import { PageHeader } from "@/components/navigation/page-header";
import { Card } from "@/components/ui/card";
import { PlayerStatSearchEditor, type StatCandidate, type StatEntry } from "@/components/stats/player-stat-search-editor";
import { ParticipantsSelector } from "@/components/stats/participants-selector";
import { MatchScoreEditor } from "@/components/matches/match-score-editor";
import { VotingPanel, type VotingPlayer } from "@/components/voting/voting-panel";
import { requireAuth } from "@/shared/auth/require-auth";
import { getActiveOrgId } from "@/shared/orgs/active-org-cookie";
import { membershipRepository } from "@/modules/organizations/repositories/membership-repository";
import { guestPlayerRepository } from "@/modules/guest-players/repositories/guest-player-repository";
import { matchRepository } from "@/modules/matches/repositories/match-repository";
import { getMatchPerspective } from "@/modules/matches/lib/format";
import { saveMatchPlayerStatsAction } from "@/modules/matches/actions/save-match-player-stats";
import { removeMatchPlayerStatAction } from "@/modules/matches/actions/remove-match-player-stat";
import { updateMatchScoreAction } from "@/modules/matches/actions/update-match-score";
import { setMatchParticipantsAction } from "@/modules/matches/actions/set-match-participants";
import { openMatchVotingAction, closeMatchVotingAction } from "@/modules/matches/actions/manage-match-voting";
import { submitMatchVoteAction } from "@/modules/matches/actions/submit-match-vote";
import { formatListingDateTime } from "@/modules/game-listings/lib/format";
import { isVotingOpen } from "@/shared/voting/voting-window";

const MANAGER_ROLES = ["OWNER", "ADMIN", "CAPTAIN"];
const VOTING_MANAGER_ROLES = ["OWNER", "ADMIN", "CAPTAIN"];

function playerDisplayName(user: { email: string; profile: { fullName: string | null; nickname: string | null } | null }) {
  return user.profile?.nickname || user.profile?.fullName || user.email;
}

export default async function MatchDetailPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await params;
  const session = await requireAuth();

  const activeOrgId = await getActiveOrgId();
  if (!activeOrgId) {
    redirect("/dashboard");
  }

  const match = await matchRepository.findById(matchId);
  if (!match) {
    notFound();
  }

  const membership = await membershipRepository.findByUserAndOrganizations(session.id, [
    match.homeOrganizationId,
    match.awayOrganizationId,
  ]);
  if (!membership) {
    throw new Error("Você não tem permissão para ver este jogo.");
  }

  const isManager = MANAGER_ROLES.includes(membership.role);
  const canManageVoting = VOTING_MANAGER_ROLES.includes(membership.role);

  const { opponentLabel, teamScore, opponentScore, outcome } = getMatchPerspective(match, activeOrgId);

  const [members, guests] = await Promise.all([
    membershipRepository.listByOrganization(activeOrgId),
    guestPlayerRepository.listByOrganization(activeOrgId),
  ]);

  const candidates: StatCandidate[] = [
    ...members.map((m) => ({
      kind: "user" as const,
      id: m.userId,
      name: playerDisplayName(m.user),
      imageUrl: m.user.profile?.imageUrl ?? null,
    })),
    ...guests.map((g) => ({ kind: "guest" as const, id: g.id, name: g.name, imageUrl: null })),
  ];

  const statEntries: StatEntry[] = match.playerStats.map((stat) => {
    if (stat.guestPlayerId && stat.guestPlayer) {
      return {
        kind: "guest",
        id: stat.guestPlayerId,
        name: stat.guestPlayer.name,
        imageUrl: null,
        goals: stat.goals,
        assists: stat.assists,
        yellowCards: stat.yellowCards,
        redCards: stat.redCards,
      };
    }
    return {
      kind: "user",
      id: stat.userId!,
      name: playerDisplayName(stat.user!),
      imageUrl: stat.user!.profile?.imageUrl ?? null,
      goals: stat.goals,
      assists: stat.assists,
      yellowCards: stat.yellowCards,
      redCards: stat.redCards,
    };
  });

  const declinedUserIds = match.attendances
    .filter((a) => a.status === "DECLINED" && a.organizationId === activeOrgId)
    .map((a) => a.userId);
  const declinedSet = new Set(declinedUserIds);

  const votingPlayers: VotingPlayer[] = members
    .filter((m) => !declinedSet.has(m.userId))
    .map((m) => ({
      userId: m.userId,
      name: playerDisplayName(m.user),
      imageUrl: m.user.profile?.imageUrl ?? null,
    }));

  const votingOpen = isVotingOpen(match);
  const currentMvpVote = match.mvpVotes.find((v) => v.voterUserId === session.id)?.votedUserId ?? null;
  const currentRatings = Object.fromEntries(
    match.ratings.filter((r) => r.raterUserId === session.id).map((r) => [r.ratedUserId, r.rating]),
  );

  const mvpCounts = new Map<string, number>();
  for (const vote of match.mvpVotes) {
    mvpCounts.set(vote.votedUserId, (mvpCounts.get(vote.votedUserId) ?? 0) + 1);
  }
  const nameByUserId = new Map(votingPlayers.map((p) => [p.userId, p.name]));
  const mvpTally = [...mvpCounts.entries()]
    .map(([userId, count]) => ({ userId, name: nameByUserId.get(userId) ?? "Jogador", count }))
    .sort((a, b) => b.count - a.count);

  const ratingSums = new Map<string, { total: number; count: number }>();
  for (const rating of match.ratings) {
    const current = ratingSums.get(rating.ratedUserId) ?? { total: 0, count: 0 };
    ratingSums.set(rating.ratedUserId, { total: current.total + rating.rating, count: current.count + 1 });
  }
  const ratingTally = [...ratingSums.entries()]
    .map(([userId, { total, count }]) => ({
      userId,
      name: nameByUserId.get(userId) ?? "Jogador",
      average: total / count,
      count,
    }))
    .sort((a, b) => b.average - a.average);

  async function handleSaveStats(
    stats: {
      kind: "user" | "guest";
      id: string;
      goals: number;
      assists: number;
      yellowCards?: number;
      redCards?: number;
    }[],
  ) {
    "use server";
    await saveMatchPlayerStatsAction({ matchId, stats });
  }

  async function handleRemoveStat(entry: { kind: "user" | "guest"; id: string }) {
    "use server";
    await removeMatchPlayerStatAction({ matchId, kind: entry.kind, id: entry.id });
  }

  async function handleSaveScore(homeScore: number, awayScore: number) {
    "use server";
    await updateMatchScoreAction({ matchId, homeScore, awayScore });
  }

  async function handleSaveParticipants(nextDeclinedUserIds: string[]) {
    "use server";
    await setMatchParticipantsAction({ matchId, organizationId: activeOrgId!, declinedUserIds: nextDeclinedUserIds });
  }

  async function handleOpenVoting() {
    "use server";
    await openMatchVotingAction({ matchId });
  }

  async function handleCloseVoting() {
    "use server";
    await closeMatchVotingAction({ matchId });
  }

  async function handleSubmitVote(mvpUserId: string, ratings: Record<string, number>) {
    "use server";
    await submitMatchVoteAction({
      matchId,
      mvpUserId,
      ratings: Object.entries(ratings).map(([ratedUserId, rating]) => ({ ratedUserId, rating })),
    });
  }

  return (
    <PageTransition className="space-y-6">
      <Link
        href="/time/agenda"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Toda a agenda
      </Link>

      <PageHeader
        eyebrow="Time"
        title={`vs ${opponentLabel}`}
        description="Estatísticas do jogo e votação de melhor em campo."
      />

      <Card className="space-y-2 p-4">
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <CalendarDays className="size-4 shrink-0" />
          <span className="capitalize">{formatListingDateTime(match.scheduledAt)}</span>
        </p>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" />
          {match.location}
        </p>
        {teamScore != null && opponentScore != null && (
          <p className="pt-1 text-2xl font-black text-foreground">
            {teamScore} <span className="text-muted-foreground/60">x</span> {opponentScore}
            {outcome && (
              <span className="ml-2 align-middle text-xs font-bold text-muted-foreground">
                ({outcome === "V" ? "Vitória" : outcome === "D" ? "Derrota" : "Empate"})
              </span>
            )}
          </p>
        )}
      </Card>

      {isManager && (
        <MatchScoreEditor
          homeLabel={match.homeOrganization.name}
          awayLabel={match.awayOrganization?.name ?? match.opponentName ?? "Adversário"}
          homeScore={match.homeScore}
          awayScore={match.awayScore}
          onSave={handleSaveScore}
        />
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-black text-foreground">Estatísticas</h2>
        {isManager ? (
          <PlayerStatSearchEditor
            candidates={candidates}
            initialEntries={statEntries}
            trackCards
            onSave={handleSaveStats}
            onRemove={handleRemoveStat}
          />
        ) : (
          <div className="space-y-2">
            {statEntries.map((entry) => (
              <Card key={`${entry.kind}:${entry.id}`} className="flex items-center justify-between p-3">
                <p className="font-bold text-foreground">{entry.name}</p>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <span>
                    {entry.goals} gol{entry.goals !== 1 ? "s" : ""} · {entry.assists} assist.
                  </span>
                  {!!entry.yellowCards && (
                    <span className="inline-flex items-center gap-1">
                      <span className="inline-block h-3 w-2 rounded-[2px] bg-amber-400" />
                      {entry.yellowCards}
                    </span>
                  )}
                  {!!entry.redCards && (
                    <span className="inline-flex items-center gap-1">
                      <span className="inline-block h-3 w-2 rounded-[2px] bg-rose-500" />
                      {entry.redCards}
                    </span>
                  )}
                </p>
              </Card>
            ))}
          </div>
        )}
      </section>

      {isManager && (
        <section className="space-y-3">
          <div>
            <h2 className="text-lg font-black text-foreground">Participantes</h2>
            <p className="text-sm text-muted-foreground">
              Todos vêm marcados por padrão. Desmarque quem não participou deste jogo.
            </p>
          </div>
          <ParticipantsSelector
            members={members.map((m) => ({
              userId: m.userId,
              name: playerDisplayName(m.user),
              imageUrl: m.user.profile?.imageUrl ?? null,
            }))}
            initialDeclinedUserIds={declinedUserIds}
            onSave={handleSaveParticipants}
          />
        </section>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-black text-foreground">Melhor em campo</h2>
        {votingPlayers.length === 0 ? (
          <Card className="p-5 text-sm text-muted-foreground">
            Registre as estatísticas dos jogadores para liberar a votação.
          </Card>
        ) : (
          <VotingPanel
            players={votingPlayers}
            votingOpen={votingOpen}
            votingClosesAt={match.votingClosesAt}
            hasBeenOpened={!!match.votingOpenedAt}
            isManager={canManageVoting}
            currentMvpVote={currentMvpVote}
            currentRatings={currentRatings}
            mvpTally={mvpTally}
            ratingTally={ratingTally}
            onOpenVoting={handleOpenVoting}
            onCloseVoting={handleCloseVoting}
            onSubmitVote={handleSubmitVote}
          />
        )}
      </section>
    </PageTransition>
  );
}
