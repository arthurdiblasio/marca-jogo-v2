"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/shared/auth/require-auth";
import { requireOrgMembership } from "@/shared/orgs/require-org-membership";
import { peladaOccurrenceRepository } from "../repositories/pelada-occurrence-repository";
import {
  removePeladaPlayerStatSchema,
  type RemovePeladaPlayerStatInput,
} from "../schemas/pelada-occurrence-schemas";

const MANAGER_ROLES = ["OWNER", "ADMIN", "CAPTAIN"];

export async function removePeladaPlayerStatAction(input: RemovePeladaPlayerStatInput) {
  const session = await requireAuth();
  const data = removePeladaPlayerStatSchema.parse(input);

  const occurrence = await peladaOccurrenceRepository.findById(data.peladaOccurrenceId);
  if (!occurrence) {
    throw new Error("Rodada não encontrada.");
  }

  const membership = await requireOrgMembership(session.id, occurrence.organizationId);
  if (!MANAGER_ROLES.includes(membership.role)) {
    throw new Error("Você não tem permissão para editar as estatísticas desta rodada.");
  }

  await peladaOccurrenceRepository.removePlayerStat({
    peladaOccurrenceId: data.peladaOccurrenceId,
    userId: data.kind === "user" ? data.id : undefined,
    guestPlayerId: data.kind === "guest" ? data.id : undefined,
  });

  revalidatePath(`/pelada/rodadas/${data.peladaOccurrenceId}`);
}
