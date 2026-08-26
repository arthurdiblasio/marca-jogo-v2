import { prisma } from "@/lib/prisma";

const userSummarySelect = {
  id: true,
  email: true,
  profile: { select: { fullName: true, nickname: true, imageUrl: true } },
} as const;

export const callUpRepository = {
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

  findMatchCallUpById(id: string) {
    return prisma.matchCallUp.findUnique({ where: { id } });
  },

  respondMatchCallUp(id: string, status: "ACCEPTED" | "DECLINED") {
    return prisma.matchCallUp.update({ where: { id }, data: { status, respondedAt: new Date() } });
  },

  listMatchCallUpsByMatch(matchId: string, organizationId: string) {
    return prisma.matchCallUp.findMany({
      where: { matchId, organizationId },
      include: { user: { select: userSummarySelect } },
    });
  },

  listPendingForUserInOrg(userId: string, organizationId: string) {
    return prisma.matchCallUp.findMany({
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
    });
  },

  countPendingForUserInOrg(userId: string, organizationId: string) {
    return prisma.matchCallUp.count({ where: { userId, status: "PENDING", organizationId } });
  },

  listPendingForUserAcrossOrgs(userId: string) {
    return prisma.matchCallUp.findMany({
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
    });
  },
};
