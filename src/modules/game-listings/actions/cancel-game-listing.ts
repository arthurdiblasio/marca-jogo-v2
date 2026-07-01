"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/shared/auth/require-auth";
import { requireOrgMembership } from "@/shared/orgs/require-org-membership";
import { gameListingRepository } from "../repositories/game-listing-repository";

export async function cancelGameListingAction(gameListingId: string) {
  const session = await requireAuth();

  const listing = await gameListingRepository.findById(gameListingId);
  if (!listing) {
    throw new Error("Jogo não encontrado.");
  }

  await requireOrgMembership(session.id, listing.organizationId);

  await gameListingRepository.cancel(gameListingId);

  revalidatePath(`/jogos/${gameListingId}`);
  revalidatePath("/jogos");
}
