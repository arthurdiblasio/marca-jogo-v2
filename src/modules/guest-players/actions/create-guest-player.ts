"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/shared/auth/require-auth";
import { requireOrgMembership } from "@/shared/orgs/require-org-membership";
import { guestPlayerRepository } from "../repositories/guest-player-repository";
import { createGuestPlayerSchema, type CreateGuestPlayerInput } from "../schemas/guest-player-schemas";

const MANAGER_ROLES = ["OWNER", "ADMIN", "CAPTAIN"];

export async function createGuestPlayerAction(input: CreateGuestPlayerInput) {
  const session = await requireAuth();
  const data = createGuestPlayerSchema.parse(input);

  const membership = await requireOrgMembership(session.id, data.organizationId);
  if (!MANAGER_ROLES.includes(membership.role)) {
    throw new Error("Você não tem permissão para adicionar jogadores convidados.");
  }

  const guest = await guestPlayerRepository.create({
    organizationId: data.organizationId,
    name: data.name,
    createdById: session.id,
  });

  revalidatePath("/time/jogadores");
  revalidatePath("/pelada/jogadores");

  return guest;
}
