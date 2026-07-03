"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAuth } from "@/shared/auth/require-auth";
import { requireOrgMembership } from "@/shared/orgs/require-org-membership";
import { membershipRepository } from "../repositories/membership-repository";

const MANAGER_ROLES = ["OWNER", "ADMIN", "CAPTAIN"];

const schema = z.object({
  membershipId: z.string(),
  isMonthly: z.boolean(),
});

export async function updateMembershipMonthlyAction(input: z.infer<typeof schema>) {
  const session = await requireAuth();
  const data = schema.parse(input);

  const targetMembership = await membershipRepository.findById(data.membershipId);
  if (!targetMembership) {
    throw new Error("Jogador não encontrado.");
  }

  const membership = await requireOrgMembership(session.id, targetMembership.organizationId);
  if (!MANAGER_ROLES.includes(membership.role)) {
    throw new Error("Você não tem permissão para editar esta informação.");
  }

  await membershipRepository.updateIsMonthly(data.membershipId, data.isMonthly);

  revalidatePath("/pelada/jogadores");
}
