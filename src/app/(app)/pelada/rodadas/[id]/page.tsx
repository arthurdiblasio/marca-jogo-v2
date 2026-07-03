import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";

import { PageTransition } from "@/components/motion/page-transition";
import { PageHeader } from "@/components/navigation/page-header";
import { Card } from "@/components/ui/card";
import { PlayerStatSearchEditor, type StatCandidate, type StatEntry } from "@/components/stats/player-stat-search-editor";
import { VotingPanel, type VotingPlayer } from "@/components/voting/voting-panel";
import { requireAuth } from "@/shared/auth/require-auth";
import { requireOrgMembership } from "@/shared/orgs/require-org-membership";
import { membershipRepository } from "@/modules/organizations/repositories/membership-repository";
import { guestPlayerRepository } from "@/modules/guest-players/repositories/guest-player-repository";
import { peladaOccurrenceRepository } from "@/modules/pelada-occurrences/repositories/pelada-occurrence-repository";
import { savePeladaPlayerStatsAction } from "@/modules/pelada-occurrences/actions/save-pelada-player-stats";
import { removePeladaPlayerStatAction } from "@/modules/pelada-occurrences/actions/remove-pelada-player-stat";
import { openPeladaVotingAction, closePeladaVotingAction } from "@/modules/pelada-occurrences/actions/manage-pelada-voting";
import { submitPeladaVoteAction } from "@/modules/pelada-occurrences/actions/submit-pelada-vote";
import { formatListingDateTime } from "@/modules/game-listings/lib/format";
import { isVotingOpen } from "@/shared/voting/voting-window";

const MANAGER_ROLES = ["OWNER", "ADMIN", "CAPTAIN"];
const VOTING_MANAGER_ROLES = ["OWNER", "ADMIN"];

function playerDisplayName(user: { email: string; profile: { fullName: string | null; nickname: string | null } | null }) {
  return user.profile?.nickname || user.profile?.fullName || user.email;
}

export default async function PeladaRodadaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireAuth();

  const occurrence = await peladaOccurrenceRepository.findById(id);
  if (!occurrence) {
    notFound();
  }

  const membership = await requireOrgMembership(session.id, occurrence.organizationId);
  const isManager = MANAGER_ROLES.includes(membership.role);
  const canManageVoting = VOTING_MANAGER_ROLES.includes(membership.role);

  const [members, guests] = await Promise.all([
    membershipRepository.listByOrganization(occurrence.organizationId),
    guestPlayerRepository.listByOrganization(occurrence.organizationId),
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

  const statEntries: StatEntry[] = occurrence.playerStats.map((stat) => {
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

  const votingPlayers: VotingPlayer[] = occurrence.playerStats
    .filter((stat) => stat.userId)
    .map((stat) => ({
      userId: stat.userId!,
      name: playerDisplayName(stat.user!),
      imageUrl: stat.user!.profile?.imageUrl ?? null,
    }));

  const votingOpen = isVotingOpen(occurrence);
  const currentMvpVote = occurrence.mvpVotes.find((v) => v.voterUserId === session.id)?.votedUserId ?? null;
  const currentRatings = Object.fromEntries(
    occurrence.ratings.filter((r) => r.raterUserId === session.id).map((r) => [r.ratedUserId, r.rating]),
  );

  const mvpCounts = new Map<string, number>();
  for (const vote of occurrence.mvpVotes) {
    mvpCounts.set(vote.votedUserId, (mvpCounts.get(vote.votedUserId) ?? 0) + 1);
  }
  const nameByUserId = new Map(votingPlayers.map((p) => [p.userId, p.name]));
  const mvpTally = [...mvpCounts.entries()]
    .map(([userId, count]) => ({ userId, name: nameByUserId.get(userId) ?? "Jogador", count }))
    .sort((a, b) => b.count - a.count);

  const ratingSums = new Map<string, { total: number; count: number }>();
  for (const rating of occurrence.ratings) {
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
    await savePeladaPlayerStatsAction({ peladaOccurrenceId: id, stats });
  }

  async function handleRemoveStat(entry: { kind: "user" | "guest"; id: string }) {
    "use server";
    await removePeladaPlayerStatAction({ peladaOccurrenceId: id, kind: entry.kind, id: entry.id });
  }

  async function handleOpenVoting() {
    "use server";
    await openPeladaVotingAction({ peladaOccurrenceId: id });
  }

  async function handleCloseVoting() {
    "use server";
    await closePeladaVotingAction({ peladaOccurrenceId: id });
  }

  async function handleSubmitVote(mvpUserId: string, ratings: Record<string, number>) {
    "use server";
    await submitPeladaVoteAction({
      peladaOccurrenceId: id,
      mvpUserId,
      ratings: Object.entries(ratings).map(([ratedUserId, rating]) => ({ ratedUserId, rating })),
    });
  }

  return (
    <PageTransition className="space-y-6">
      <Link
        href="/pelada/rodadas"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Todas as rodadas
      </Link>

      <PageHeader eyebrow="Pelada" title={occurrence.title} description="Estatísticas da rodada e votação de melhor em campo." />

      <Card className="space-y-2 p-4">
        <p className="flex items-center gap-1.5 text-sm text-slate-500">
          <CalendarDays className="size-4 shrink-0" />
          <span className="capitalize">{formatListingDateTime(occurrence.scheduledAt)}</span>
        </p>
        <p className="flex items-center gap-1.5 text-sm text-slate-500">
          <MapPin className="size-4 shrink-0" />
          {occurrence.location}
        </p>
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
            votingClosesAt={occurrence.votingClosesAt}
            hasBeenOpened={!!occurrence.votingOpenedAt}
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
