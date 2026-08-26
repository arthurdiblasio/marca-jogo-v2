import { z } from "zod";

export const createFinancialTransactionSchema = z.object({
  organizationId: z.string(),
  type: z.enum(["INCOME", "EXPENSE"]),
  amountCents: z.number().int().positive("Informe um valor maior que zero"),
  description: z.string().min(3, "Informe uma descrição").max(200),
  occurredAt: z.string().min(1, "Informe a data"),
  recurrenceDays: z.union([z.literal(7), z.literal(15), z.literal(30)]).nullable().optional(),
});

export type CreateFinancialTransactionInput = z.infer<typeof createFinancialTransactionSchema>;

export const updateFinancialTransactionStatusSchema = z.object({
  id: z.string(),
  status: z.enum(["PENDING", "PAID", "CANCELLED"]),
});

export type UpdateFinancialTransactionStatusInput = z.infer<typeof updateFinancialTransactionStatusSchema>;

export const removeFinancialTransactionSchema = z.object({
  id: z.string(),
});

export type RemoveFinancialTransactionInput = z.infer<typeof removeFinancialTransactionSchema>;
