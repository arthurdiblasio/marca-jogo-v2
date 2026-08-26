import { prisma } from "@/lib/prisma";

const organizationSummarySelect = {
  id: true,
  name: true,
  slug: true,
  logoUrl: true,
  city: true,
  state: true,
} as const;

const userSummarySelect = {
  id: true,
  email: true,
  profile: { select: { fullName: true, nickname: true, imageUrl: true } },
} as const;

export const matchRepository = {
  findById(id: string) {
    return prisma.match.findUnique({
      where: { id },
      include: {
        homeOrganization: { select: organizationSummarySelect },
        awayOrganization: { select: organizationSummarySelect },
        playerStats: { include: { user: { select: userSummarySelect }, guestPlayer: true } },
        attendances: true,
        mvpVotes: true,
        ratings: true,
        lineup: true,
        callUps: true,
      },
    });
  },

  async setLineup(matchId: string, entries: { userId: string; position: string | null; isStarter: boolean }[]) {
    await prisma.$transaction([
      prisma.matchLineupEntry.deleteMany({ where: { matchId } }),
      ...entries.map((entry) =>
        prisma.matchLineupEntry.create({
          data: { matchId, userId: entry.userId, position: entry.position, isStarter: entry.isStarter },
        }),
      ),
    ]);
  },

  async setParticipants(matchId: string, organizationId: string, declinedUserIds: string[]) {
    await prisma.$transaction([
      prisma.matchAttendance.deleteMany({ where: { matchId, organizationId } }),
      ...declinedUserIds.map((userId) =>
        prisma.matchAttendance.create({ data: { matchId, organizationId, userId, status: "DECLINED" } }),
      ),
    ]);
  },

  upsertPlayerStat(params: {
    matchId: string;
    userId?: string;
    guestPlayerId?: string;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
  }) {
    const where = params.userId
      ? { matchId_userId: { matchId: params.matchId, userId: params.userId } }
      : { matchId_guestPlayerId: { matchId: params.matchId, guestPlayerId: params.guestPlayerId! } };

    return prisma.matchPlayerStat.upsert({
      where,
      create: {
        matchId: params.matchId,
        userId: params.userId,
        guestPlayerId: params.guestPlayerId,
        goals: params.goals,
        assists: params.assists,
        yellowCards: params.yellowCards,
        redCards: params.redCards,
      },
      update: {
        goals: params.goals,
        assists: params.assists,
        yellowCards: params.yellowCards,
        redCards: params.redCards,
      },
    });
  },

  removePlayerStat(params: { matchId: string; userId?: string; guestPlayerId?: string }) {
    const where = params.userId
      ? { matchId_userId: { matchId: params.matchId, userId: params.userId } }
      : { matchId_guestPlayerId: { matchId: params.matchId, guestPlayerId: params.guestPlayerId! } };

    return prisma.matchPlayerStat.delete({ where }).catch(() => null);
  },

  updateScore(id: string, homeScore: number, awayScore: number) {
    const result = homeScore > awayScore ? "WIN" : homeScore < awayScore ? "LOSS" : "DRAW";

    return prisma.match.update({
      where: { id },
      data: { homeScore, awayScore, result, status: "FINISHED" },
    });
  },

  openVoting(id: string, votingOpenedAt: Date, votingClosesAt: Date) {
    return prisma.match.update({
      where: { id },
      data: { votingOpenedAt, votingClosesAt, votingClosedAt: null },
    });
  },

  closeVoting(id: string, closedAt: Date) {
    return prisma.match.update({
      where: { id },
      data: { votingClosedAt: closedAt },
    });
  },

  async submitVote(params: {
    matchId: string;
    voterUserId: string;
    votedUserId: string;
    ratings: { ratedUserId: string; rating: number }[];
  }) {
    await prisma.$transaction([
      prisma.matchMvpVote.upsert({
        where: { matchId_voterUserId: { matchId: params.matchId, voterUserId: params.voterUserId } },
        create: { matchId: params.matchId, voterUserId: params.voterUserId, votedUserId: params.votedUserId },
        update: { votedUserId: params.votedUserId },
      }),
      ...params.ratings.map((r) =>
        prisma.matchPlayerRating.upsert({
          where: {
            matchId_raterUserId_ratedUserId: {
              matchId: params.matchId,
              raterUserId: params.voterUserId,
              ratedUserId: r.ratedUserId,
            },
          },
          create: {
            matchId: params.matchId,
            raterUserId: params.voterUserId,
            ratedUserId: r.ratedUserId,
            rating: r.rating,
          },
          update: { rating: r.rating },
        }),
      ),
    ]);
  },

  listUpcomingByOrganization(organizationId: string, take?: number) {
    return prisma.match.findMany({
      where: {
        AND: [
          { OR: [{ homeOrganizationId: organizationId }, { awayOrganizationId: organizationId }] },
          { scheduledAt: { gte: new Date() } },
          { status: { in: ["SCHEDULED", "IN_PROGRESS"] } },
        ],
      },
      include: {
        homeOrganization: { select: organizationSummarySelect },
        awayOrganization: { select: organizationSummarySelect },
      },
      orderBy: { scheduledAt: "asc" },
      take,
    });
  },

  listPastByOrganization(organizationId: string, take = 20, skip = 0) {
    return prisma.match.findMany({
      where: {
        AND: [
          { OR: [{ homeOrganizationId: organizationId }, { awayOrganizationId: organizationId }] },
          { OR: [{ scheduledAt: { lt: new Date() } }, { status: { in: ["FINISHED", "CANCELLED"] } }] },
        ],
      },
      include: {
        homeOrganization: { select: organizationSummarySelect },
        awayOrganization: { select: organizationSummarySelect },
      },
      orderBy: { scheduledAt: "desc" },
      take,
      skip,
    });
  },

  countPastByOrganization(organizationId: string) {
    return prisma.match.count({
      where: {
        AND: [
          { OR: [{ homeOrganizationId: organizationId }, { awayOrganizationId: organizationId }] },
          { OR: [{ scheduledAt: { lt: new Date() } }, { status: { in: ["FINISHED", "CANCELLED"] } }] },
        ],
      },
    });
  },
};
