"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/shared/auth/require-auth";
import { membershipRepository } from "@/modules/organizations/repositories/membership-repository";
import { matchRepository } from "../repositories/match-repository";
import { saveMatchPlayerStatsSchema, type SaveMatchPlayerStatsInput } from "../schemas/match-stats-schemas";

const MANAGER_ROLES = ["OWNER", "ADMIN", "CAPTAIN"];

export async function saveMatchPlayerStatsAction(input: SaveMatchPlayerStatsInput) {
  const session = await requireAuth();
  const data = saveMatchPlayerStatsSchema.parse(input);

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

  await Promise.all(
    data.stats.map((stat) =>
      matchRepository.upsertPlayerStat({
        matchId: data.matchId,
        userId: stat.kind === "user" ? stat.id : undefined,
        guestPlayerId: stat.kind === "guest" ? stat.id : undefined,
        goals: stat.goals,
        assists: stat.assists,
      }),
    ),
  );

  revalidatePath(`/time/agenda/${data.matchId}`);
}
