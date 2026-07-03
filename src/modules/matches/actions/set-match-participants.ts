"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/shared/auth/require-auth";
import { requireOrgMembership } from "@/shared/orgs/require-org-membership";
import { matchRepository } from "../repositories/match-repository";
import { setMatchParticipantsSchema, type SetMatchParticipantsInput } from "../schemas/match-stats-schemas";

const MANAGER_ROLES = ["OWNER", "ADMIN", "CAPTAIN"];

export async function setMatchParticipantsAction(input: SetMatchParticipantsInput) {
  const session = await requireAuth();
  const data = setMatchParticipantsSchema.parse(input);

  const match = await matchRepository.findById(data.matchId);
  if (!match) {
    throw new Error("Jogo não encontrado.");
  }

  if (match.homeOrganizationId !== data.organizationId && match.awayOrganizationId !== data.organizationId) {
    throw new Error("Essa organização não participa deste jogo.");
  }

  const membership = await requireOrgMembership(session.id, data.organizationId);
  if (!MANAGER_ROLES.includes(membership.role)) {
    throw new Error("Você não tem permissão para editar os participantes deste jogo.");
  }

  await matchRepository.setParticipants(data.matchId, data.organizationId, data.declinedUserIds);

  revalidatePath(`/time/agenda/${data.matchId}`);
}
