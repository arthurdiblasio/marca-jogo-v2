import { prisma } from "@/lib/prisma";

const userSummarySelect = {
  id: true,
  email: true,
  profile: { select: { fullName: true, nickname: true, imageUrl: true } },
} as const;

export const peladaOccurrenceRepository = {
  listByOrganization(organizationId: string, take = 20) {
    return prisma.peladaOccurrence.findMany({
      where: { organizationId },
      orderBy: { scheduledAt: "desc" },
      take,
    });
  },

  findById(id: string) {
    return prisma.peladaOccurrence.findUnique({
      where: { id },
      include: {
        organization: { select: { id: true, name: true } },
        playerStats: { include: { user: { select: userSummarySelect }, guestPlayer: true } },
        mvpVotes: true,
        ratings: true,
      },
    });
  },

  create(data: { organizationId: string; title: string; scheduledAt: Date; location: string; createdById: string }) {
    return prisma.peladaOccurrence.create({ data });
  },

  upsertPlayerStat(params: {
    peladaOccurrenceId: string;
    userId?: string;
    guestPlayerId?: string;
    goals: number;
    assists: number;
  }) {
    const where = params.userId
      ? { peladaOccurrenceId_userId: { peladaOccurrenceId: params.peladaOccurrenceId, userId: params.userId } }
      : { peladaOccurrenceId_guestPlayerId: { peladaOccurrenceId: params.peladaOccurrenceId, guestPlayerId: params.guestPlayerId! } };

    return prisma.peladaPlayerStat.upsert({
      where,
      create: {
        peladaOccurrenceId: params.peladaOccurrenceId,
        userId: params.userId,
        guestPlayerId: params.guestPlayerId,
        goals: params.goals,
        assists: params.assists,
      },
      update: {
        goals: params.goals,
        assists: params.assists,
      },
    });
  },

  removePlayerStat(params: { peladaOccurrenceId: string; userId?: string; guestPlayerId?: string }) {
    const where = params.userId
      ? { peladaOccurrenceId_userId: { peladaOccurrenceId: params.peladaOccurrenceId, userId: params.userId } }
      : { peladaOccurrenceId_guestPlayerId: { peladaOccurrenceId: params.peladaOccurrenceId, guestPlayerId: params.guestPlayerId! } };

    return prisma.peladaPlayerStat.delete({ where }).catch(() => null);
  },

  openVoting(id: string, votingOpenedAt: Date, votingClosesAt: Date) {
    return prisma.peladaOccurrence.update({
      where: { id },
      data: { votingOpenedAt, votingClosesAt, votingClosedAt: null },
    });
  },

  closeVoting(id: string, closedAt: Date) {
    return prisma.peladaOccurrence.update({
      where: { id },
      data: { votingClosedAt: closedAt },
    });
  },

  findVoteByUser(peladaOccurrenceId: string, voterUserId: string) {
    return prisma.peladaMvpVote.findUnique({
      where: { peladaOccurrenceId_voterUserId: { peladaOccurrenceId, voterUserId } },
    });
  },

  findRatingsByUser(peladaOccurrenceId: string, raterUserId: string) {
    return prisma.peladaPlayerRating.findMany({
      where: { peladaOccurrenceId, raterUserId },
    });
  },

  async submitVote(params: {
    peladaOccurrenceId: string;
    voterUserId: string;
    votedUserId: string;
    ratings: { ratedUserId: string; rating: number }[];
  }) {
    await prisma.$transaction([
      prisma.peladaMvpVote.upsert({
        where: {
          peladaOccurrenceId_voterUserId: {
            peladaOccurrenceId: params.peladaOccurrenceId,
            voterUserId: params.voterUserId,
          },
        },
        create: {
          peladaOccurrenceId: params.peladaOccurrenceId,
          voterUserId: params.voterUserId,
          votedUserId: params.votedUserId,
        },
        update: { votedUserId: params.votedUserId },
      }),
      ...params.ratings.map((r) =>
        prisma.peladaPlayerRating.upsert({
          where: {
            peladaOccurrenceId_raterUserId_ratedUserId: {
              peladaOccurrenceId: params.peladaOccurrenceId,
              raterUserId: params.voterUserId,
              ratedUserId: r.ratedUserId,
            },
          },
          create: {
            peladaOccurrenceId: params.peladaOccurrenceId,
            raterUserId: params.voterUserId,
            ratedUserId: r.ratedUserId,
            rating: r.rating,
          },
          update: { rating: r.rating },
        }),
      ),
    ]);
  },
};
