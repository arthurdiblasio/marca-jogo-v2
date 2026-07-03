"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/shared/auth/require-auth";
import { requireOrgMembership } from "@/shared/orgs/require-org-membership";
import { membershipRepository } from "@/modules/organizations/repositories/membership-repository";
import { guestPlayerRepository } from "../repositories/guest-player-repository";
import { mergeGuestPlayerSchema, type MergeGuestPlayerInput } from "../schemas/guest-player-schemas";

const MANAGER_ROLES = ["OWNER", "ADMIN", "CAPTAIN"];

export async function mergeGuestPlayerAction(input: MergeGuestPlayerInput) {
  const session = await requireAuth();
  const data = mergeGuestPlayerSchema.parse(input);

  const guest = await guestPlayerRepository.findById(data.guestPlayerId);
  if (!guest) {
    throw new Error("Jogador convidado não encontrado.");
  }

  const membership = await requireOrgMembership(session.id, guest.organizationId);
  if (!MANAGER_ROLES.includes(membership.role)) {
    throw new Error("Você não tem permissão para vincular jogadores convidados.");
  }

  const targetMembership = await membershipRepository.findByUserAndOrganizations(data.userId, [
    guest.organizationId,
  ]);
  if (!targetMembership) {
    throw new Error("O usuário selecionado não é membro desta organização.");
  }

  if (targetMembership.hasMergedGuest) {
    throw new Error("Este jogador já recebeu os dados de um convidado antes e não pode receber outro.");
  }

  await guestPlayerRepository.mergeIntoUser(data.guestPlayerId, data.userId, targetMembership.id);

  revalidatePath("/time/jogadores");
  revalidatePath("/pelada/jogadores");
}
