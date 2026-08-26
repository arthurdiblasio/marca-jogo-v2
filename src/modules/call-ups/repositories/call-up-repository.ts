import { prisma } from "@/lib/prisma";

const userSummarySelect = {
  id: true,
  email: true,
  profile: { select: { fullName: true, nickname: true, imageUrl: true } },
} as const;

export const callUpRepository = {
  async createPeladaCallUps(peladaOccurrenceId: string, userIds: string[], slots: number | null | undefined) {
    await prisma.$transaction([
      prisma.peladaOccurrence.update({ where: { id: peladaOccurrenceId }, data: { callUpSlots: slots ?? null } }),
      prisma.peladaCallUp.deleteMany({ where: { peladaOccurrenceId } }),
      ...userIds.map((userId) =>
        prisma.peladaCallUp.create({ data: { peladaOccurrenceId, userId, status: "PENDING" } }),
      ),
    ]);
  },

  async createMatchCallUps(
    matchId: string,
    organizationId: string,
    userIds: string[],
    slots: number | null | undefined,
  ) {
    await prisma.$transaction([
      prisma.match.update({ where: { id: matchId }, data: { callUpSlots: slots ?? null } }),
      prisma.matchCallUp.deleteMany({ where: { matchId, organizationId } }),
      ...userIds.map((userId) =>
        prisma.matchCallUp.create({ data: { matchId, userId, organizationId, status: "PENDING" } }),
      ),
    ]);
  },

  findPeladaCallUpById(id: string) {
    return prisma.peladaCallUp.findUnique({ where: { id } });
  },

  findMatchCallUpById(id: string) {
    return prisma.matchCallUp.findUnique({ where: { id } });
  },

  respondPeladaCallUp(id: string, status: "ACCEPTED" | "DECLINED") {
    return prisma.peladaCallUp.update({ where: { id }, data: { status, respondedAt: new Date() } });
  },

  respondMatchCallUp(id: string, status: "ACCEPTED" | "DECLINED") {
    return prisma.matchCallUp.update({ where: { id }, data: { status, respondedAt: new Date() } });
  },

  listPeladaCallUpsByOccurrence(peladaOccurrenceId: string) {
    return prisma.peladaCallUp.findMany({
      where: { peladaOccurrenceId },
      include: { user: { select: userSummarySelect } },
    });
  },

  listMatchCallUpsByMatch(matchId: string, organizationId: string) {
    return prisma.matchCallUp.findMany({
      where: { matchId, organizationId },
      include: { user: { select: userSummarySelect } },
    });
  },

  async listPendingForUserInOrg(userId: string, organizationId: string) {
    const [peladaCallUps, matchCallUps] = await Promise.all([
      prisma.peladaCallUp.findMany({
        where: { userId, status: "PENDING", peladaOccurrence: { organizationId } },
        include: { peladaOccurrence: { select: { id: true, title: true, scheduledAt: true, organizationId: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.matchCallUp.findMany({
        where: { userId, status: "PENDING", organizationId },
        include: {
          match: {
            select: {
              id: true,
              scheduledAt: true,
              opponentName: true,
              homeOrganizationId: true,
              awayOrganizationId: true,
              homeOrganization: { select: { name: true } },
              awayOrganization: { select: { name: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return { peladaCallUps, matchCallUps };
  },

  countPendingForUserInOrg(userId: string, organizationId: string) {
    return Promise.all([
      prisma.peladaCallUp.count({ where: { userId, status: "PENDING", peladaOccurrence: { organizationId } } }),
      prisma.matchCallUp.count({ where: { userId, status: "PENDING", organizationId } }),
    ]).then(([a, b]) => a + b);
  },

  async listPendingForUserAcrossOrgs(userId: string) {
    const [peladaCallUps, matchCallUps] = await Promise.all([
      prisma.peladaCallUp.findMany({
        where: { userId, status: "PENDING" },
        include: {
          peladaOccurrence: {
            select: { id: true, title: true, scheduledAt: true, organizationId: true, organization: { select: { name: true } } },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.matchCallUp.findMany({
        where: { userId, status: "PENDING" },
        include: {
          organization: { select: { id: true, name: true } },
          match: {
            select: {
              id: true,
              scheduledAt: true,
              opponentName: true,
              homeOrganizationId: true,
              homeOrganization: { select: { name: true } },
              awayOrganization: { select: { name: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return { peladaCallUps, matchCallUps };
  },
};
