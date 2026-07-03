"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/shared/auth/require-auth";
import { requireOrgMembership } from "@/shared/orgs/require-org-membership";
import { peladaOccurrenceRepository } from "../repositories/pelada-occurrence-repository";
import { submitPeladaVoteSchema, type SubmitPeladaVoteInput } from "../schemas/pelada-occurrence-schemas";
import { isVotingOpen } from "@/shared/voting/voting-window";

export async function submitPeladaVoteAction(input: SubmitPeladaVoteInput) {
  const session = await requireAuth();
  const data = submitPeladaVoteSchema.parse(input);

  const occurrence = await peladaOccurrenceRepository.findById(data.peladaOccurrenceId);
  if (!occurrence) {
    throw new Error("Rodada não encontrada.");
  }

  await requireOrgMembership(session.id, occurrence.organizationId);

  if (!isVotingOpen(occurrence)) {
    throw new Error("A votação desta rodada não está aberta.");
  }

  await peladaOccurrenceRepository.submitVote({
    peladaOccurrenceId: data.peladaOccurrenceId,
    voterUserId: session.id,
    votedUserId: data.mvpUserId,
    ratings: data.ratings,
  });

  revalidatePath(`/pelada/rodadas/${data.peladaOccurrenceId}`);
}
