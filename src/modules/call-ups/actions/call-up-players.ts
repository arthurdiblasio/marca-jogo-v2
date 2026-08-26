"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/shared/auth/require-auth";
import { requireOrgMembership } from "@/shared/orgs/require-org-membership";
import { peladaOccurrenceRepository } from "@/modules/pelada-occurrences/repositories/pelada-occurrence-repository";
import { matchRepository } from "@/modules/matches/repositories/match-repository";
import { callUpRepository } from "../repositories/call-up-repository";
import {
  callUpPeladaPlayersSchema,
  callUpMatchPlayersSchema,
  type CallUpPeladaPlayersInput,
  type CallUpMatchPlayersInput,
} from "../schemas/call-up-schemas";

const MANAGER_ROLES = ["OWNER", "ADMIN", "CAPTAIN"];

export async function callUpPeladaPlayersAction(input: CallUpPeladaPlayersInput) {
  const session = await requireAuth();
  const data = callUpPeladaPlayersSchema.parse(input);

  const occurrence = await peladaOccurrenceRepository.findById(data.peladaOccurrenceId);
  if (!occurrence) {
    throw new Error("Rodada não encontrada.");
  }

  const membership = await requireOrgMembership(session.id, occurrence.organizationId);
  if (!MANAGER_ROLES.includes(membership.role)) {
    throw new Error("Você não tem permissão para convocar jogadores para esta rodada.");
  }

  await callUpRepository.createPeladaCallUps(data.peladaOccurrenceId, data.userIds, data.slots);

  revalidatePath(`/pelada/rodadas/${data.peladaOccurrenceId}`);
}

export async function callUpMatchPlayersAction(input: CallUpMatchPlayersInput) {
  const session = await requireAuth();
  const data = callUpMatchPlayersSchema.parse(input);

  const match = await matchRepository.findById(data.matchId);
  if (!match) {
    throw new Error("Jogo não encontrado.");
  }

  if (data.organizationId !== match.homeOrganizationId && data.organizationId !== match.awayOrganizationId) {
    throw new Error("Organização não participa deste jogo.");
  }

  const membership = await requireOrgMembership(session.id, data.organizationId);
  if (!MANAGER_ROLES.includes(membership.role)) {
    throw new Error("Você não tem permissão para convocar jogadores para este jogo.");
  }

  await callUpRepository.createMatchCallUps(data.matchId, data.organizationId, data.userIds, data.slots);

  revalidatePath(`/time/agenda/${data.matchId}`);
}
