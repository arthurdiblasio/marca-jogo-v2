import { prisma } from "@/lib/prisma";
import type { MembershipRole } from "@/generated/prisma/enums";

export const membershipRepository = {
  listByOrganization(organizationId: string) {
    return prisma.membership.findMany({
      where: { organizationId, status: "ACTIVE" },
      include: { user: { include: { profile: true } } },
      orderBy: { joinedAt: "asc" },
    });
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
