import { prisma } from "@/lib/prisma";

export const guestPlayerRepository = {
  listByOrganization(organizationId: string) {
    return prisma.guestPlayer.findMany({
      where: { organizationId },
      orderBy: { name: "asc" },
    });
  },

  findById(id: string) {
    return prisma.guestPlayer.findUnique({ where: { id } });
  },

  create(data: { organizationId: string; name: string; createdById: string }) {
    return prisma.guestPlayer.create({ data });
  },

  async mergeIntoUser(guestPlayerId: string, userId: string, membershipId: string) {
    await prisma.$transaction(async (tx) => {
      await tx.membership.update({ where: { id: membershipId }, data: { hasMergedGuest: true } });

      const guestPeladaStats = await tx.peladaPlayerStat.findMany({ where: { guestPlayerId } });
      for (const stat of guestPeladaStats) {
        const existing = await tx.peladaPlayerStat.findUnique({
          where: { peladaOccurrenceId_userId: { peladaOccurrenceId: stat.peladaOccurrenceId, userId } },
        });
        if (existing) {
          await tx.peladaPlayerStat.update({
            where: { id: existing.id },
            data: { goals: existing.goals + stat.goals, assists: existing.assists + stat.assists },
          });
          await tx.peladaPlayerStat.delete({ where: { id: stat.id } });
        } else {
          await tx.peladaPlayerStat.update({
            where: { id: stat.id },
            data: { userId, guestPlayerId: null },
          });
        }
      }

      const guestMatchStats = await tx.matchPlayerStat.findMany({ where: { guestPlayerId } });
      for (const stat of guestMatchStats) {
        const existing = await tx.matchPlayerStat.findUnique({
          where: { matchId_userId: { matchId: stat.matchId, userId } },
        });
        if (existing) {
          await tx.matchPlayerStat.update({
            where: { id: existing.id },
            data: { goals: existing.goals + stat.goals, assists: existing.assists + stat.assists },
          });
          await tx.matchPlayerStat.delete({ where: { id: stat.id } });
        } else {
          await tx.matchPlayerStat.update({
            where: { id: stat.id },
            data: { userId, guestPlayerId: null },
          });
        }
      }

      await tx.guestPlayer.delete({ where: { id: guestPlayerId } });
    });
  },
};
