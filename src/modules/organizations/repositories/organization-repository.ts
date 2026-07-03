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

  findById(id: string) {
    return prisma.organization.findUnique({ where: { id } });
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
    logoUrl?: string;
    address?: string;
    city?: string;
    state?: string;
    lat?: number;
    lng?: number;
    description?: string;
    weekday?: number;
    scheduledTime?: string;
    monthlyFee?: number;
    singleFee?: number;
    createdById: string;
  }) {
    return prisma.$transaction(async (tx) => {
      const org = await tx.organization.create({
        data: {
          name: data.name,
          slug: data.slug,
          type: data.type,
          modality: data.modality,
          logoUrl: data.logoUrl,
          address: data.address,
          city: data.city,
          state: data.state,
          lat: data.lat,
          lng: data.lng,
          description: data.description,
          weekday: data.weekday,
          scheduledTime: data.scheduledTime,
          monthlyFee: data.monthlyFee,
          singleFee: data.singleFee,
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

  update(
    id: string,
    data: {
      name: string;
      modality?: SportModality;
      logoUrl?: string;
      address?: string;
      city?: string;
      state?: string;
      lat?: number;
      lng?: number;
      description?: string;
      weekday?: number;
      scheduledTime?: string;
      monthlyFee?: number;
      singleFee?: number;
    },
  ) {
    return prisma.organization.update({
      where: { id },
      data: {
        name: data.name,
        modality: data.modality,
        logoUrl: data.logoUrl,
        address: data.address,
        city: data.city,
        state: data.state,
        lat: data.lat,
        lng: data.lng,
        description: data.description,
        weekday: data.weekday,
        scheduledTime: data.scheduledTime,
        monthlyFee: data.monthlyFee,
        singleFee: data.singleFee,
      },
    });
  },
};
