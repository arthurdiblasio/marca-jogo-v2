"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/shared/auth/require-auth";
import { requireOrgMembership } from "@/shared/orgs/require-org-membership";
import { organizationRepository } from "../repositories/organization-repository";
import {
  updateOrganizationSchema,
  type UpdateOrganizationInput,
} from "../schemas/update-organization-schema";
import type { SportModality } from "@/generated/prisma/enums";

const MANAGER_ROLES = ["OWNER", "ADMIN", "CAPTAIN"];

export async function updateOrganizationAction(input: UpdateOrganizationInput) {
  const session = await requireAuth();

  const data = updateOrganizationSchema.parse(input);

  const membership = await requireOrgMembership(session.id, data.organizationId);
  if (!MANAGER_ROLES.includes(membership.role)) {
    throw new Error("Você não tem permissão para editar os dados desta organização.");
  }

  const org = await organizationRepository.update(data.organizationId, {
    name: data.name,
    modality: data.modality as SportModality | undefined,
    logoUrl: data.logoUrl,
    address: data.address,
    city: data.city,
    state: data.state,
    lat: data.lat,
    lng: data.lng,
    description: data.description,
    weekday: data.weekday,
    scheduledTime: data.scheduledTime,
    monthlyFee: data.monthlyFee,
    singleFee: data.singleFee,
  });

  revalidatePath("/time");
  revalidatePath("/time/jogadores");
  revalidatePath("/pelada");
  revalidatePath("/pelada/jogadores");
  revalidatePath("/dashboard");

  return org;
}
