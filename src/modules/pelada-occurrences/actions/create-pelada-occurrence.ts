"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/shared/auth/require-auth";
import { requireOrgMembership } from "@/shared/orgs/require-org-membership";
import { peladaOccurrenceRepository } from "../repositories/pelada-occurrence-repository";
import {
  createPeladaOccurrenceSchema,
  type CreatePeladaOccurrenceInput,
} from "../schemas/pelada-occurrence-schemas";

const MANAGER_ROLES = ["OWNER", "ADMIN", "CAPTAIN"];

export async function createPeladaOccurrenceAction(input: CreatePeladaOccurrenceInput) {
  const session = await requireAuth();
  const data = createPeladaOccurrenceSchema.parse(input);

  const membership = await requireOrgMembership(session.id, data.organizationId);
  if (!MANAGER_ROLES.includes(membership.role)) {
    throw new Error("Você não tem permissão para registrar um encontro.");
  }

  const occurrence = await peladaOccurrenceRepository.create({
    organizationId: data.organizationId,
    title: data.title,
    scheduledAt: new Date(data.scheduledAt),
    location: data.location,
    createdById: session.id,
  });

  revalidatePath("/pelada/encontros");

  return occurrence;
}
