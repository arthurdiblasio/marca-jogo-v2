import { prisma } from "@/lib/prisma";

const organizationSummarySelect = {
  id: true,
  name: true,
  slug: true,
  logoUrl: true,
  city: true,
  state: true,
} as const;

export const matchRepository = {
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

  listPastByOrganization(organizationId: string, take = 20) {
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
    });
  },
};
