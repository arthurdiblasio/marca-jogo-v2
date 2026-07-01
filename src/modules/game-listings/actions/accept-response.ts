"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/shared/auth/require-auth";
import { requireOrgMembership } from "@/shared/orgs/require-org-membership";
import { gameListingRepository } from "../repositories/game-listing-repository";

export async function acceptResponseAction(input: { gameListingId: string; responseId: string }) {
  const session = await requireAuth();

  const listing = await gameListingRepository.findById(input.gameListingId);
  if (!listing) {
    throw new Error("Jogo não encontrado.");
  }

  await requireOrgMembership(session.id, listing.organizationId);

  await gameListingRepository.acceptResponse({
    gameListingId: input.gameListingId,
    responseId: input.responseId,
    acceptingUserId: session.id,
  });

  revalidatePath(`/jogos/${input.gameListingId}`);
}
