"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/shared/auth/require-auth";
import { getActiveOrgId } from "@/shared/orgs/active-org-cookie";
import { requireOrgMembership } from "@/shared/orgs/require-org-membership";
import { gameListingRepository } from "../repositories/game-listing-repository";
import { expressInterestSchema, type ExpressInterestInput } from "../schemas/express-interest-schema";

export async function expressInterestAction(input: ExpressInterestInput) {
  const session = await requireAuth();

  const organizationId = await getActiveOrgId();
  if (!organizationId) {
    throw new Error("Nenhuma organização ativa selecionada.");
  }

  await requireOrgMembership(session.id, organizationId);

  const data = expressInterestSchema.parse(input);

  const listing = await gameListingRepository.findById(data.gameListingId);
  if (!listing) {
    throw new Error("Jogo não encontrado.");
  }
  if (listing.status !== "OPEN") {
    throw new Error("Este jogo não está mais aberto para interessados.");
  }
  if (listing.organizationId === organizationId) {
    throw new Error("Você não pode demonstrar interesse no seu próprio jogo.");
  }

  try {
    await gameListingRepository.addResponse({
      gameListingId: data.gameListingId,
      organizationId,
      respondedById: session.id,
      message: data.message,
    });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
      throw new Error("Sua organização já demonstrou interesse neste jogo.");
    }
    throw error;
  }

  revalidatePath(`/jogos/${data.gameListingId}`);
}
