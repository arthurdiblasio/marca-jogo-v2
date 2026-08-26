"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/shared/auth/require-auth";
import { requireOrgMembership } from "@/shared/orgs/require-org-membership";
import { financialTransactionRepository } from "../repositories/financial-transaction-repository";
import {
  removeFinancialTransactionSchema,
  type RemoveFinancialTransactionInput,
} from "../schemas/financial-transaction-schemas";

const MANAGER_ROLES = ["OWNER", "ADMIN", "CAPTAIN"];

export async function removeFinancialTransactionAction(input: RemoveFinancialTransactionInput) {
  const session = await requireAuth();
  const data = removeFinancialTransactionSchema.parse(input);

  const transaction = await financialTransactionRepository.findById(data.id);
  if (!transaction) {
    throw new Error("Transação não encontrada.");
  }

  const membership = await requireOrgMembership(session.id, transaction.organizationId);
  if (!MANAGER_ROLES.includes(membership.role)) {
    throw new Error("Você não tem permissão para remover esta transação.");
  }

  await financialTransactionRepository.remove(data.id);

  revalidatePath("/pelada/financeiro");
  revalidatePath("/time/financeiro");
}
