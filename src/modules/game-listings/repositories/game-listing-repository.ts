import { prisma } from "@/lib/prisma";
import type { GameListingFrequency, SportModality } from "@/generated/prisma/enums";

const organizationSummarySelect = {
  id: true,
  name: true,
  slug: true,
  logoUrl: true,
  city: true,
  state: true,
} as const;

type ListingData = {
  modality: SportModality;
  location: string;
  city: string;
  state: string;
  priceCents?: number;
  priceNotes?: string;
  notes?: string;
};

export const gameListingRepository = {
  create(params: {
    organizationId: string;
    createdById: string;
    scheduledAt: Date;
    photoUrls: string[];
    data: ListingData;
  }) {
    return prisma.gameListing.create({
      data: {
        organizationId: params.organizationId,
        createdById: params.createdById,
        scheduledAt: params.scheduledAt,
        modality: params.data.modality,
        location: params.data.location,
        city: params.data.city,
        state: params.data.state,
        priceCents: params.data.priceCents,
        priceNotes: params.data.priceNotes,
        notes: params.data.notes,
        photos: {
          create: params.photoUrls.map((url, order) => ({ url, order })),
        },
      },
    });
  },

  createSeries(params: {
    organizationId: string;
    createdById: string;
    frequency: GameListingFrequency;
    startDate: Date;
    endDate: Date;
    occurrenceDates: Date[];
    photoUrls: string[];
    data: ListingData;
  }) {
    return prisma.$transaction(async (tx) => {
      const series = await tx.gameListingSeries.create({
        data: {
          organizationId: params.organizationId,
          createdById: params.createdById,
          frequency: params.frequency,
          startDate: params.startDate,
          endDate: params.endDate,
        },
      });

      await tx.gameListing.createMany({
        data: params.occurrenceDates.map((scheduledAt) => ({
          organizationId: params.organizationId,
          createdById: params.createdById,
          seriesId: series.id,
          scheduledAt,
          modality: params.data.modality,
          location: params.data.location,
          city: params.data.city,
          state: params.data.state,
          priceCents: params.data.priceCents,
          priceNotes: params.data.priceNotes,
          notes: params.data.notes,
        })),
      });

      const occurrences = await tx.gameListing.findMany({
        where: { seriesId: series.id },
        select: { id: true },
        orderBy: { scheduledAt: "asc" },
      });

      if (params.photoUrls.length > 0) {
        await tx.gameListingPhoto.createMany({
          data: occurrences.flatMap((occurrence) =>
            params.photoUrls.map((url, order) => ({
              gameListingId: occurrence.id,
              gameListingSeriesId: series.id,
              url,
              order,
            }))
          ),
        });
      }

      return {
        series,
        firstListingId: occurrences[0]?.id ?? null,
        count: occurrences.length,
      };
    });
  },

  listOpen(filters: { city?: string; state?: string; modality?: SportModality }) {
    return prisma.gameListing.findMany({
      where: {
        status: "OPEN",
        scheduledAt: { gte: new Date() },
        city: filters.city ? { equals: filters.city, mode: "insensitive" } : undefined,
        state: filters.state ? { equals: filters.state, mode: "insensitive" } : undefined,
        modality: filters.modality,
      },
      include: {
        organization: { select: organizationSummarySelect },
        photos: { orderBy: { order: "asc" }, take: 1 },
        _count: { select: { responses: true } },
      },
      orderBy: { scheduledAt: "asc" },
    });
  },

  findById(id: string) {
    return prisma.gameListing.findUnique({
      where: { id },
      include: {
        organization: { select: organizationSummarySelect },
        series: true,
        photos: { orderBy: { order: "asc" } },
        responses: {
          include: { organization: { select: organizationSummarySelect } },
          orderBy: { createdAt: "asc" },
        },
        match: true,
      },
    });
  },

  addResponse(params: { gameListingId: string; organizationId: string; respondedById: string; message?: string }) {
    return prisma.gameListingResponse.create({
      data: {
        gameListingId: params.gameListingId,
        organizationId: params.organizationId,
        respondedById: params.respondedById,
        message: params.message,
      },
    });
  },

  async acceptResponse(params: { gameListingId: string; responseId: string; acceptingUserId: string }) {
    return prisma.$transaction(async (tx) => {
      const listing = await tx.gameListing.findUniqueOrThrow({ where: { id: params.gameListingId } });

      if (listing.status !== "OPEN") {
        throw new Error("Este jogo já foi encerrado ou cancelado.");
      }

      const accepted = await tx.gameListingResponse.update({
        where: { id: params.responseId },
        data: { status: "ACCEPTED" },
      });

      await tx.gameListingResponse.updateMany({
        where: { gameListingId: params.gameListingId, id: { not: params.responseId }, status: "PENDING" },
        data: { status: "DECLINED" },
      });

      const match = await tx.match.create({
        data: {
          scheduledAt: listing.scheduledAt,
          location: listing.location,
          lat: listing.lat,
          lng: listing.lng,
          homeOrganizationId: listing.organizationId,
          awayOrganizationId: accepted.organizationId,
          createdById: params.acceptingUserId,
          status: "SCHEDULED",
        },
      });

      return tx.gameListing.update({
        where: { id: params.gameListingId },
        data: { status: "MATCHED", matchId: match.id },
      });
    });
  },

  cancel(id: string) {
    return prisma.gameListing.update({ where: { id }, data: { status: "CANCELLED" } });
  },

  findSeriesById(seriesId: string) {
    return prisma.gameListingSeries.findUnique({ where: { id: seriesId } });
  },

  cancelSeries(seriesId: string) {
    return prisma.$transaction([
      prisma.gameListingSeries.update({ where: { id: seriesId }, data: { isCancelled: true } }),
      prisma.gameListing.updateMany({
        where: { seriesId, status: "OPEN", scheduledAt: { gte: new Date() } },
        data: { status: "CANCELLED" },
      }),
    ]);
  },
};
