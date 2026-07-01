"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/shared/auth/require-auth";
import { getActiveOrgId } from "@/shared/orgs/active-org-cookie";
import { requireOrgMembership } from "@/shared/orgs/require-org-membership";
import { playerInviteRepository } from "../repositories/player-invite-repository";

const MANAGER_ROLES = ["OWNER", "ADMIN", "CAPTAIN"];

export async function createPlayerInviteAction() {
  const session = await requireAuth();

  const organizationId = await getActiveOrgId();
  if (!organizationId) {
    throw new Error("Selecione uma organização ativa.");
  }

  const membership = await requireOrgMembership(session.id, organizationId);
  if (!MANAGER_ROLES.includes(membership.role)) {
    throw new Error("Você não tem permissão para convidar jogadores.");
  }

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const invite = await playerInviteRepository.create({
    organizationId,
    createdById: session.id,
    expiresAt,
  });

  revalidatePath("/time/jogadores");

  return invite;
}
