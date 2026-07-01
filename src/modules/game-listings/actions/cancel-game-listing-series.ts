"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/shared/auth/require-auth";
import { requireOrgMembership } from "@/shared/orgs/require-org-membership";
import { gameListingRepository } from "../repositories/game-listing-repository";

export async function cancelGameListingSeriesAction(seriesId: string) {
  const session = await requireAuth();

  const series = await gameListingRepository.findSeriesById(seriesId);
  if (!series) {
    throw new Error("Série de jogos não encontrada.");
  }

  await requireOrgMembership(session.id, series.organizationId);

  await gameListingRepository.cancelSeries(seriesId);

  revalidatePath("/jogos");
}
