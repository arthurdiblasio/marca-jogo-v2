import { prisma } from "@/lib/prisma";
import { membershipRepository } from "@/modules/organizations/repositories/membership-repository";
import type { Player, RankingItem } from "@/types/design-system";

function displayName(membership: {
  nickname: string | null;
  user: { profile: { fullName: string | null; nickname: string | null } | null; email: string };
}) {
  return (
    membership.nickname ??
    membership.user.profile?.nickname ??
    membership.user.profile?.fullName ??
    membership.user.email
  );
}

function formatScore(value: number | null) {
  return value == null ? "-" : value.toFixed(1);
}

export const rankingRepository = {
  async getPeladaPlayerRanking(organizationId: string): Promise<RankingItem[]> {
    const members = await membershipRepository.listByOrganization(organizationId);
    const memberIds = members.map((m) => m.userId);
    if (memberIds.length === 0) return [];

    const occurrences = await prisma.peladaOccurrence.findMany({
      where: { organizationId },
      select: { id: true },
    });
    const occurrenceIds = occurrences.map((o) => o.id);
    if (occurrenceIds.length === 0) return [];

    const ratings = await prisma.peladaPlayerRating.groupBy({
      by: ["ratedUserId"],
      where: { peladaOccurrenceId: { in: occurrenceIds }, ratedUserId: { in: memberIds } },
      _avg: { rating: true },
    });

    const ratingByUserId = new Map(ratings.map((r) => [r.ratedUserId, r._avg.rating]));

    return members
      .filter((m) => ratingByUserId.has(m.userId))
      .map((m) => ({
        name: displayName(m),
        score: formatScore(ratingByUserId.get(m.userId) ?? null),
        trend: "stable" as const,
      }))
      .sort((a, b) => Number(b.score) - Number(a.score));
  },

  async getMatchPlayerRanking(organizationId: string): Promise<RankingItem[]> {
    const members = await membershipRepository.listByOrganization(organizationId);
    const memberIds = members.map((m) => m.userId);
    if (memberIds.length === 0) return [];

    const matches = await prisma.match.findMany({
      where: { OR: [{ homeOrganizationId: organizationId }, { awayOrganizationId: organizationId }] },
      select: { id: true },
    });
    const matchIds = matches.map((m) => m.id);
    if (matchIds.length === 0) return [];

    const ratings = await prisma.matchPlayerRating.groupBy({
      by: ["ratedUserId"],
      where: { matchId: { in: matchIds }, ratedUserId: { in: memberIds } },
      _avg: { rating: true },
    });

    const ratingByUserId = new Map(ratings.map((r) => [r.ratedUserId, r._avg.rating]));

    return members
      .filter((m) => ratingByUserId.has(m.userId))
      .map((m) => ({
        name: displayName(m),
        score: formatScore(ratingByUserId.get(m.userId) ?? null),
        trend: "stable" as const,
      }))
      .sort((a, b) => Number(b.score) - Number(a.score));
  },

  async getPeladaCollectiveStats(organizationId: string) {
    const [occurrencesCount, members, statsAggregate, statsCount] = await Promise.all([
      prisma.peladaOccurrence.count({ where: { organizationId } }),
      membershipRepository.listByOrganization(organizationId),
      prisma.peladaPlayerStat.aggregate({
        where: { peladaOccurrence: { organizationId } },
        _sum: { goals: true, assists: true },
      }),
      prisma.peladaPlayerStat.count({ where: { peladaOccurrence: { organizationId } } }),
    ]);

    const attendanceRate =
      occurrencesCount > 0 && members.length > 0
        ? Math.min(100, Math.round((statsCount / (occurrencesCount * members.length)) * 100))
        : 0;

    return [
      { label: "Presenças", value: String(statsCount), helper: `Em ${occurrencesCount} encontros` },
      { label: "Gols", value: String(statsAggregate._sum.goals ?? 0), helper: "Total da temporada" },
      { label: "Assiduidade", value: `${attendanceRate}%`, helper: "Média do grupo" },
    ];
  },

  async getTeamCollectiveStats(organizationId: string) {
    const matches = await prisma.match.findMany({
      where: {
        OR: [{ homeOrganizationId: organizationId }, { awayOrganizationId: organizationId }],
        status: "FINISHED",
      },
      orderBy: { scheduledAt: "desc" },
      select: { homeOrganizationId: true, homeScore: true, awayScore: true },
    });

    if (matches.length === 0) {
      return [
        { label: "Aproveitamento", value: "-", helper: "Sem jogos finalizados" },
        { label: "Gols Pró", value: "0", helper: "-" },
        { label: "Gols Contra", value: "0", helper: "-" },
        { label: "Sequência", value: "0", helper: "-" },
      ];
    }

    let wins = 0;
    let goalsFor = 0;
    let goalsAgainst = 0;
    let streak = 0;
    let streakBroken = false;

    for (const match of matches) {
      const isHome = match.homeOrganizationId === organizationId;
      const teamScore = (isHome ? match.homeScore : match.awayScore) ?? 0;
      const opponentScore = (isHome ? match.awayScore : match.homeScore) ?? 0;

      goalsFor += teamScore;
      goalsAgainst += opponentScore;
      if (teamScore > opponentScore) wins += 1;

      if (!streakBroken) {
        if (teamScore >= opponentScore) streak += 1;
        else streakBroken = true;
      }
    }

    const winRate = Math.round((wins / matches.length) * 100);

    return [
      { label: "Aproveitamento", value: `${winRate}%`, helper: "Temporada atual" },
      { label: "Gols Pró", value: String(goalsFor), helper: `${(goalsFor / matches.length).toFixed(1)} por jogo` },
      { label: "Gols Contra", value: String(goalsAgainst), helper: `${(goalsAgainst / matches.length).toFixed(1)} por jogo` },
      { label: "Sequência", value: String(streak), helper: "Jogos sem perder" },
    ];
  },

  async getTeamSquad(organizationId: string): Promise<Player[]> {
    const [members, matches] = await Promise.all([
      membershipRepository.listByOrganization(organizationId),
      prisma.match.findMany({
        where: { OR: [{ homeOrganizationId: organizationId }, { awayOrganizationId: organizationId }] },
        select: { id: true },
      }),
    ]);

    const matchIds = matches.map((m) => m.id);
    const ratings =
      matchIds.length > 0
        ? await prisma.matchPlayerRating.groupBy({
            by: ["ratedUserId"],
            where: { matchId: { in: matchIds } },
            _avg: { rating: true },
          })
        : [];
    const ratingByUserId = new Map(ratings.map((r) => [r.ratedUserId, r._avg.rating]));

    return members.map((m) => ({
      name: displayName(m),
      position: m.position ?? "-",
      number: m.shirtNumber ?? 0,
      rating: formatScore(ratingByUserId.get(m.userId) ?? null),
    }));
  },
};
