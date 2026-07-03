import { prisma } from "@/lib/prisma";
import type { MembershipRole } from "@/generated/prisma/enums";

export const membershipRepository = {
  listByOrganization(organizationId: string) {
    return prisma.membership.findMany({
      where: { organizationId, status: "ACTIVE" },
      include: { user: { include: { profile: { include: { modalityPositions: true } } } } },
      orderBy: { joinedAt: "asc" },
    });
  },

  findById(id: string) {
    return prisma.membership.findUnique({ where: { id } });
  },

  findByUserAndOrganizations(userId: string, organizationIds: (string | null)[]) {
    const ids = organizationIds.filter((id): id is string => id != null);
    return prisma.membership.findFirst({
      where: { userId, organizationId: { in: ids }, status: "ACTIVE" },
    });
  },

  updateIsMonthly(id: string, isMonthly: boolean) {
    return prisma.membership.update({ where: { id }, data: { isMonthly } });
  },

  upsertActivePlayer(params: { userId: string; organizationId: string; role?: MembershipRole }) {
    return prisma.membership.upsert({
      where: { userId_organizationId: { userId: params.userId, organizationId: params.organizationId } },
      update: { status: "ACTIVE" },
      create: {
        userId: params.userId,
        organizationId: params.organizationId,
        role: params.role ?? "PLAYER",
        status: "ACTIVE",
      },
    });
  },
};
