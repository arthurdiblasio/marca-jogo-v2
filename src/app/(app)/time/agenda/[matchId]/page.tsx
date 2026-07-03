import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";

import { PageTransition } from "@/components/motion/page-transition";
import { PageHeader } from "@/components/navigation/page-header";
import { Card } from "@/components/ui/card";
import { PlayerStatSearchEditor, type StatCandidate, type StatEntry } from "@/components/stats/player-stat-search-editor";
import { VotingPanel, type VotingPlayer } from "@/components/voting/voting-panel";
import { requireAuth } from "@/shared/auth/require-auth";
import { getActiveOrgId } from "@/shared/orgs/active-org-cookie";
import { membershipRepository } from "@/modules/organizations/repositories/membership-repository";
import { guestPlayerRepository } from "@/modules/guest-players/repositories/guest-player-repository";
import { matchRepository } from "@/modules/matches/repositories/match-repository";
import { getMatchPerspective } from "@/modules/matches/lib/format";
import { saveMatchPlayerStatsAction } from "@/modules/matches/actions/save-match-player-stats";
import { removeMatchPlayerStatAction } from "@/modules/matches/actions/remove-match-player-stat";
import { openMatchVotingAction, closeMatchVotingAction } from "@/modules/matches/actions/manage-match-voting";
import { submitMatchVoteAction } from "@/modules/matches/actions/submit-match-vote";
import { formatListingDateTime } from "@/modules/game-listings/lib/format";
import { isVotingOpen } from "@/shared/voting/voting-window";

const MANAGER_ROLES = ["OWNER", "ADMIN", "CAPTAIN"];
const VOTING_MANAGER_ROLES = ["OWNER", "ADMIN"];

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
      return { kind: "guest", id: stat.guestPlayerId, name: stat.guestPlayer.name, imageUrl: null, goals: stat.goals, assists: stat.assists };
    }
    return {
      kind: "user",
      id: stat.userId!,
      name: playerDisplayName(stat.user!),
      imageUrl: stat.user!.profile?.imageUrl ?? null,
      goals: stat.goals,
      assists: stat.assists,
    };
  });

  const votingPlayers: VotingPlayer[] = match.playerStats
    .filter((stat) => stat.userId)
    .map((stat) => ({
      userId: stat.userId!,
      name: playerDisplayName(stat.user!),
      imageUrl: stat.user!.profile?.imageUrl ?? null,
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

  async function handleSaveStats(stats: { kind: "user" | "guest"; id: string; goals: number; assists: number }[]) {
    "use server";
    await saveMatchPlayerStatsAction({ matchId, stats });
  }

  async function handleRemoveStat(entry: { kind: "user" | "guest"; id: string }) {
    "use server";
    await removeMatchPlayerStatAction({ matchId, kind: entry.kind, id: entry.id });
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
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-primary"
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
        <p className="flex items-center gap-1.5 text-sm text-slate-500">
          <CalendarDays className="size-4 shrink-0" />
          <span className="capitalize">{formatListingDateTime(match.scheduledAt)}</span>
        </p>
        <p className="flex items-center gap-1.5 text-sm text-slate-500">
          <MapPin className="size-4 shrink-0" />
          {match.location}
        </p>
        {teamScore != null && opponentScore != null && (
          <p className="pt-1 text-2xl font-black text-slate-900">
            {teamScore} <span className="text-slate-300">x</span> {opponentScore}
            {outcome && (
              <span className="ml-2 align-middle text-xs font-bold text-slate-400">
                ({outcome === "V" ? "Vitória" : outcome === "D" ? "Derrota" : "Empate"})
              </span>
            )}
          </p>
        )}
      </Card>

      <section className="space-y-3">
        <h2 className="text-lg font-black text-slate-900">Estatísticas</h2>
        {isManager ? (
          <PlayerStatSearchEditor
            candidates={candidates}
            initialEntries={statEntries}
            onSave={handleSaveStats}
            onRemove={handleRemoveStat}
          />
        ) : (
          <div className="space-y-2">
            {statEntries.map((entry) => (
              <Card key={`${entry.kind}:${entry.id}`} className="flex items-center justify-between p-3">
                <p className="font-bold text-slate-900">{entry.name}</p>
                <p className="text-sm text-slate-500">
                  {entry.goals} gol{entry.goals !== 1 ? "s" : ""} · {entry.assists} assist.
                </p>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-black text-slate-900">Melhor em campo</h2>
        {votingPlayers.length === 0 ? (
          <Card className="p-5 text-sm text-slate-400">
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
