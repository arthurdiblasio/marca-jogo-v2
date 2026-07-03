"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAuth } from "@/shared/auth/require-auth";
import { requireOrgMembership } from "@/shared/orgs/require-org-membership";
import { peladaOccurrenceRepository } from "../repositories/pelada-occurrence-repository";
import { computeVotingClosesAt } from "@/shared/voting/voting-window";

const OPEN_CLOSE_ROLES = ["OWNER", "ADMIN"];

const schema = z.object({ peladaOccurrenceId: z.string() });

async function requireOccurrenceManager(peladaOccurrenceId: string) {
  const session = await requireAuth();
  const occurrence = await peladaOccurrenceRepository.findById(peladaOccurrenceId);
  if (!occurrence) {
    throw new Error("Rodada não encontrada.");
  }

  const membership = await requireOrgMembership(session.id, occurrence.organizationId);
  if (!OPEN_CLOSE_ROLES.includes(membership.role)) {
    throw new Error("Apenas o dono ou administradores podem gerenciar a votação.");
  }

  return occurrence;
}

export async function openPeladaVotingAction(input: z.infer<typeof schema>) {
  const data = schema.parse(input);
  await requireOccurrenceManager(data.peladaOccurrenceId);

  const now = new Date();
  await peladaOccurrenceRepository.openVoting(data.peladaOccurrenceId, now, computeVotingClosesAt(now));

  revalidatePath(`/pelada/rodadas/${data.peladaOccurrenceId}`);
}

export async function closePeladaVotingAction(input: z.infer<typeof schema>) {
  const data = schema.parse(input);
  await requireOccurrenceManager(data.peladaOccurrenceId);

  await peladaOccurrenceRepository.closeVoting(data.peladaOccurrenceId, new Date());

  revalidatePath(`/pelada/rodadas/${data.peladaOccurrenceId}`);
}
