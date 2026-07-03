"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAuth } from "@/shared/auth/require-auth";
import { membershipRepository } from "@/modules/organizations/repositories/membership-repository";
import { matchRepository } from "../repositories/match-repository";
import { computeVotingClosesAt } from "@/shared/voting/voting-window";

const OPEN_CLOSE_ROLES = ["OWNER", "ADMIN", "CAPTAIN"];

const schema = z.object({ matchId: z.string() });

async function requireMatchManager(matchId: string) {
  const session = await requireAuth();
  const match = await matchRepository.findById(matchId);
  if (!match) {
    throw new Error("Jogo não encontrado.");
  }

  const membership = await membershipRepository.findByUserAndOrganizations(session.id, [
    match.homeOrganizationId,
    match.awayOrganizationId,
  ]);

  if (!membership || !OPEN_CLOSE_ROLES.includes(membership.role)) {
    throw new Error("Apenas o dono, administradores ou capitão podem gerenciar a votação.");
  }

  return match;
}

export async function openMatchVotingAction(input: z.infer<typeof schema>) {
  const data = schema.parse(input);
  await requireMatchManager(data.matchId);

  const now = new Date();
  await matchRepository.openVoting(data.matchId, now, computeVotingClosesAt(now));

  revalidatePath(`/time/agenda/${data.matchId}`);
}

export async function closeMatchVotingAction(input: z.infer<typeof schema>) {
  const data = schema.parse(input);
  await requireMatchManager(data.matchId);

  await matchRepository.closeVoting(data.matchId, new Date());

  revalidatePath(`/time/agenda/${data.matchId}`);
}
