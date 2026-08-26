"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/shared/auth/require-auth";
import { requireOrgMembership } from "@/shared/orgs/require-org-membership";
import { financialTransactionRepository } from "../repositories/financial-transaction-repository";
import { computeRecurringOccurrences } from "../lib/recurrence";
import {
  createFinancialTransactionSchema,
  type CreateFinancialTransactionInput,
} from "../schemas/financial-transaction-schemas";

const MANAGER_ROLES = ["OWNER", "ADMIN", "CAPTAIN"];

export async function createFinancialTransactionAction(input: CreateFinancialTransactionInput) {
  const session = await requireAuth();
  const data = createFinancialTransactionSchema.parse(input);

  const membership = await requireOrgMembership(session.id, data.organizationId);
  if (!MANAGER_ROLES.includes(membership.role)) {
    throw new Error("Você não tem permissão para registrar transações financeiras.");
  }

  const baseEntry = {
    organizationId: data.organizationId,
    createdById: session.id,
    type: data.type,
    amountCents: data.amountCents,
    description: data.description,
  };

  if (data.recurrenceDays) {
    const occurrences = computeRecurringOccurrences(new Date(data.occurredAt), data.recurrenceDays);
    await financialTransactionRepository.createMany(
      occurrences.map((occurredAt) => ({ ...baseEntry, occurredAt })),
    );

    revalidatePath("/pelada/financeiro");
    revalidatePath("/time/financeiro");

    return { count: occurrences.length };
  }

  const transaction = await financialTransactionRepository.create({
    ...baseEntry,
    occurredAt: new Date(data.occurredAt),
  });

  revalidatePath("/pelada/financeiro");
  revalidatePath("/time/financeiro");

  return transaction;
}
