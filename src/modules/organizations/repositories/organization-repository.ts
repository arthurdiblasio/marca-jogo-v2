import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import type { OrganizationType, SportModality } from "@/generated/prisma/enums";

export const organizationRepository = {
  findByUserId(userId: string) {
    return prisma.organization.findMany({
      where: {
        memberships: { some: { userId, status: "ACTIVE" } },
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        type: true,
        logoUrl: true,
        modality: true,
      },
      orderBy: { createdAt: "asc" },
    });
  },

  async generateUniqueSlug(name: string): Promise<string> {
    const base = slugify(name);
    let slug = base;
    let i = 1;
    while (
      await prisma.organization.findUnique({ where: { slug }, select: { id: true } })
    ) {
      slug = `${base}-${i++}`;
    }
    return slug;
  },

  create(data: {
    name: string;
    slug: string;
    type: OrganizationType;
    modality?: SportModality;
    city?: string;
    state?: string;
    description?: string;
    createdById: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: {
          name: data.name,
          slug: data.slug,
          type: data.type,
          modality: data.modality,
          city: data.city,
          state: data.state,
          description: data.description,
          createdById: data.createdById,
        },
      });

      await tx.membership.create({
        data: {
          userId: data.createdById,
          organizationId: org.id,
          role: "OWNER",
          status: "ACTIVE",
        },
      });

      return org;
    });
  },
};
