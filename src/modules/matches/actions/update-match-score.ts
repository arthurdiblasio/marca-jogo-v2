"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/shared/auth/require-auth";
import { membershipRepository } from "@/modules/organizations/repositories/membership-repository";
import { matchRepository } from "../repositories/match-repository";
import { updateMatchScoreSchema, type UpdateMatchScoreInput } from "../schemas/match-stats-schemas";

const MANAGER_ROLES = ["OWNER", "ADMIN", "CAPTAIN"];

export async function updateMatchScoreAction(input: UpdateMatchScoreInput) {
  const session = await requireAuth();
  const data = updateMatchScoreSchema.parse(input);

  const match = await matchRepository.findById(data.matchId);
  if (!match) {
    throw new Error("Jogo não encontrado.");
  }

  const membership = await membershipRepository.findByUserAndOrganizations(session.id, [
    match.homeOrganizationId,
    match.awayOrganizationId,
  ]);

  if (!membership || !MANAGER_ROLES.includes(membership.role)) {
    throw new Error("Você não tem permissão para editar o placar deste jogo.");
  }

  await matchRepository.updateScore(data.matchId, data.homeScore, data.awayScore);

  revalidatePath(`/time/agenda/${data.matchId}`);
  revalidatePath("/time/agenda");
  revalidatePath("/dashboard");
}
