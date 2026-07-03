"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/shared/auth/require-auth";
import { requireOrgMembership } from "@/shared/orgs/require-org-membership";
import { peladaOccurrenceRepository } from "../repositories/pelada-occurrence-repository";
import {
  setPeladaParticipantsSchema,
  type SetPeladaParticipantsInput,
} from "../schemas/pelada-occurrence-schemas";

const MANAGER_ROLES = ["OWNER", "ADMIN", "CAPTAIN"];

export async function setPeladaParticipantsAction(input: SetPeladaParticipantsInput) {
  const session = await requireAuth();
  const data = setPeladaParticipantsSchema.parse(input);

  const occurrence = await peladaOccurrenceRepository.findById(data.peladaOccurrenceId);
  if (!occurrence) {
    throw new Error("Rodada não encontrada.");
  }

  const membership = await requireOrgMembership(session.id, occurrence.organizationId);
  if (!MANAGER_ROLES.includes(membership.role)) {
    throw new Error("Você não tem permissão para editar os participantes desta rodada.");
  }

  await peladaOccurrenceRepository.setParticipants(data.peladaOccurrenceId, data.declinedUserIds);

  revalidatePath(`/pelada/rodadas/${data.peladaOccurrenceId}`);
}
