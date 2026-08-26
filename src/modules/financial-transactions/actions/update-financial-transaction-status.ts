"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/shared/auth/require-auth";
import { requireOrgMembership } from "@/shared/orgs/require-org-membership";
import { financialTransactionRepository } from "../repositories/financial-transaction-repository";
import {
  updateFinancialTransactionStatusSchema,
  type UpdateFinancialTransactionStatusInput,
} from "../schemas/financial-transaction-schemas";

const MANAGER_ROLES = ["OWNER", "ADMIN", "CAPTAIN"];

export async function updateFinancialTransactionStatusAction(input: UpdateFinancialTransactionStatusInput) {
  const session = await requireAuth();
  const data = updateFinancialTransactionStatusSchema.parse(input);

  const transaction = await financialTransactionRepository.findById(data.id);
  if (!transaction) {
    throw new Error("Transação não encontrada.");
  }

  const membership = await requireOrgMembership(session.id, transaction.organizationId);
  if (!MANAGER_ROLES.includes(membership.role)) {
    throw new Error("Você não tem permissão para editar esta transação.");
  }

  await financialTransactionRepository.updateStatus(data.id, data.status);

  revalidatePath("/pelada/financeiro");
  revalidatePath("/time/financeiro");
}
