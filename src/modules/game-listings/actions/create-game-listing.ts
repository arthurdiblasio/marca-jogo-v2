"use server";

import { redirect } from "next/navigation";

import { requireAuth } from "@/shared/auth/require-auth";
import { getActiveOrgId } from "@/shared/orgs/active-org-cookie";
import { uploadImageToCloudinary } from "@/shared/storage/cloudinary-storage";
import { organizationRepository } from "@/modules/organizations/repositories/organization-repository";
import { gameListingRepository } from "../repositories/game-listing-repository";
import { createGameListingSchema } from "../schemas/create-game-listing-schema";
import { computeSeriesEndDate, computeSeriesOccurrences } from "../lib/recurrence";

export async function createGameListingAction(formData: FormData) {
  const session = await requireAuth();

  const organizationId = await getActiveOrgId();
  if (!organizationId) {
    throw new Error("Nenhuma organização ativa selecionada.");
  }

  const organization = await organizationRepository.findById(organizationId);
  if (!organization || organization.type !== "TEAM") {
    throw new Error("Apenas organizações do tipo Time podem publicar jogos.");
  }

  const raw = Object.fromEntries(formData.entries());
  const data = createGameListingSchema.parse({
    ...raw,
    isRecurring: raw.isRecurring === "true",
    priceCents: raw.priceCents ? Number(raw.priceCents) : undefined,
  });

  const files = formData.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  const folder = `marca-jogo/organizations/${organizationId}`;
  const uploaded = await Promise.all(files.map((file) => uploadImageToCloudinary(file, folder)));
  const photoUrls = uploaded.map((result) => result.url);

  const listingData = {
    modality: data.modality,
    location: data.location,
    city: data.city,
    state: data.state,
    lat: data.lat,
    lng: data.lng,
    priceCents: data.priceCents,
    priceNotes: data.priceNotes,
    notes: data.notes,
  };

  if (data.isRecurring && data.frequency) {
    const occurrenceDates = computeSeriesOccurrences({ startDate: data.scheduledAt, frequency: data.frequency });
    const result = await gameListingRepository.createSeries({
      organizationId,
      createdById: session.id,
      frequency: data.frequency,
      startDate: data.scheduledAt,
      endDate: computeSeriesEndDate(data.scheduledAt),
      occurrenceDates,
      photoUrls,
      data: listingData,
    });

    if (!result.firstListingId) {
      throw new Error("Não foi possível gerar as datas do jogo recorrente.");
    }

    redirect(`/jogos/${result.firstListingId}`);
  }

  const listing = await gameListingRepository.create({
    organizationId,
    createdById: session.id,
    scheduledAt: data.scheduledAt,
    photoUrls,
    data: listingData,
  });

  redirect(`/jogos/${listing.id}`);
}
