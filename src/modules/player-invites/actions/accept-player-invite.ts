"use server";

import { requireAuth } from "@/shared/auth/require-auth";
import { setActiveOrgIdCookie } from "@/shared/orgs/active-org-cookie";
import { playerInviteRepository } from "../repositories/player-invite-repository";
import { membershipRepository } from "@/modules/organizations/repositories/membership-repository";

export async function acceptPlayerInviteAction(token: string) {
  const session = await requireAuth();

  const invite = await playerInviteRepository.findByToken(token);
  if (!invite || invite.status !== "PENDING" || invite.expiresAt < new Date()) {
    throw new Error("Convite inválido ou expirado.");
  }

  await membershipRepository.upsertActivePlayer({
    userId: session.id,
    organizationId: invite.organizationId,
    role: invite.role,
  });

  await playerInviteRepository.markAccepted({ id: invite.id, usedByUserId: session.id });
  await setActiveOrgIdCookie(invite.organizationId);

  return { organizationId: invite.organizationId, organizationName: invite.organization.name };
}
