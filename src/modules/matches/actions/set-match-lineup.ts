"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/shared/auth/require-auth";
import { membershipRepository } from "@/modules/organizations/repositories/membership-repository";
import { matchRepository } from "../repositories/match-repository";
import { setMatchLineupSchema, type SetMatchLineupInput } from "../schemas/match-stats-schemas";

const MANAGER_ROLES = ["OWNER", "ADMIN", "CAPTAIN"];

export async function setMatchLineupAction(input: SetMatchLineupInput) {
  const session = await requireAuth();
  const data = setMatchLineupSchema.parse(input);

  const match = await matchRepository.findById(data.matchId);
  if (!match) {
    throw new Error("Jogo não encontrado.");
  }

  const membership = await membershipRepository.findByUserAndOrganizations(session.id, [
    match.homeOrganizationId,
    match.awayOrganizationId,
  ]);

  if (!membership || !MANAGER_ROLES.includes(membership.role)) {
    throw new Error("Você não tem permissão para editar a escalação deste jogo.");
  }

  await matchRepository.setLineup(
    data.matchId,
    data.entries.map((entry) => ({
      userId: entry.userId,
      position: entry.position ?? null,
      isStarter: entry.isStarter,
    })),
  );

  revalidatePath(`/time/agenda/${data.matchId}`);
}
