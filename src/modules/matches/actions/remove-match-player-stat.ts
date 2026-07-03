"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/shared/auth/require-auth";
import { membershipRepository } from "@/modules/organizations/repositories/membership-repository";
import { matchRepository } from "../repositories/match-repository";
import { removeMatchPlayerStatSchema, type RemoveMatchPlayerStatInput } from "../schemas/match-stats-schemas";

const MANAGER_ROLES = ["OWNER", "ADMIN", "CAPTAIN"];

export async function removeMatchPlayerStatAction(input: RemoveMatchPlayerStatInput) {
  const session = await requireAuth();
  const data = removeMatchPlayerStatSchema.parse(input);

  const match = await matchRepository.findById(data.matchId);
  if (!match) {
    throw new Error("Jogo não encontrado.");
  }

  const membership = await membershipRepository.findByUserAndOrganizations(session.id, [
    match.homeOrganizationId,
    match.awayOrganizationId,
  ]);

  if (!membership || !MANAGER_ROLES.includes(membership.role)) {
    throw new Error("Você não tem permissão para editar as estatísticas deste jogo.");
  }

  await matchRepository.removePlayerStat({
    matchId: data.matchId,
    userId: data.kind === "user" ? data.id : undefined,
    guestPlayerId: data.kind === "guest" ? data.id : undefined,
  });

  revalidatePath(`/time/agenda/${data.matchId}`);
}
