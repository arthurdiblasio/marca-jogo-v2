import { randomBytes } from "node:crypto";

import { prisma } from "@/lib/prisma";
import type { MembershipRole } from "@/generated/prisma/enums";

const organizationSummarySelect = {
  id: true,
  name: true,
  slug: true,
  logoUrl: true,
} as const;

export const playerInviteRepository = {
  create(params: { organizationId: string; createdById: string; expiresAt: Date; role?: MembershipRole }) {
    return prisma.playerInvite.create({
      data: {
        token: randomBytes(24).toString("base64url"),
        organizationId: params.organizationId,
        createdById: params.createdById,
        expiresAt: params.expiresAt,
        role: params.role ?? "PLAYER",
      },
    });
  },

  findByToken(token: string) {
    return prisma.playerInvite.findUnique({
      where: { token },
      include: { organization: { select: organizationSummarySelect } },
    });
  },

  listActiveByOrganization(organizationId: string) {
    return prisma.playerInvite.findMany({
      where: { organizationId, status: "PENDING", expiresAt: { gt: new Date() } },
      orderBy: { createdAt: "desc" },
    });
  },

  markAccepted(params: { id: string; usedByUserId: string }) {
    return prisma.playerInvite.update({
      where: { id: params.id },
      data: { status: "ACCEPTED", usedByUserId: params.usedByUserId },
    });
  },

  cancel(id: string) {
    return prisma.playerInvite.update({
      where: { id },
      data: { status: "CANCELLED" },
    });
  },
};
