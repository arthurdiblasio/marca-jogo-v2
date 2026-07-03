"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/shared/auth/require-auth";
import { membershipRepository } from "@/modules/organizations/repositories/membership-repository";
import { matchRepository } from "../repositories/match-repository";
import { submitMatchVoteSchema, type SubmitMatchVoteInput } from "../schemas/match-stats-schemas";
import { isVotingOpen } from "@/shared/voting/voting-window";

export async function submitMatchVoteAction(input: SubmitMatchVoteInput) {
  const session = await requireAuth();
  const data = submitMatchVoteSchema.parse(input);

  const match = await matchRepository.findById(data.matchId);
  if (!match) {
    throw new Error("Jogo não encontrado.");
  }

  const membership = await membershipRepository.findByUserAndOrganizations(session.id, [
    match.homeOrganizationId,
    match.awayOrganizationId,
  ]);
  if (!membership) {
    throw new Error("Você não tem permissão para votar neste jogo.");
  }

  if (!isVotingOpen(match)) {
    throw new Error("A votação deste jogo não está aberta.");
  }

  await matchRepository.submitVote({
    matchId: data.matchId,
    voterUserId: session.id,
    votedUserId: data.mvpUserId,
    ratings: data.ratings,
  });

  revalidatePath(`/time/agenda/${data.matchId}`);
}
