import { z } from "zod";

export const createGameListingSchema = z
  .object({
    modality: z.enum(["FIELD_11", "SOCIETY_7", "SOCIETY_8", "FUTSAL_5"]),
    scheduledAt: z.coerce.date(),
    location: z.string().min(3, "Informe o nome do local").max(120),
    city: z.string().min(1, "Informe a cidade").max(60),
    state: z.string().length(2, "Use a sigla do estado"),
    priceCents: z.coerce.number().int().nonnegative().optional(),
    priceNotes: z.string().max(120).optional(),
    notes: z.string().max(500).optional(),
    isRecurring: z.boolean().default(false),
    frequency: z.enum(["DAILY", "WEEKLY", "BIWEEKLY", "MONTHLY"]).optional(),
  })
  .refine((data) => !data.isRecurring || !!data.frequency, {
    message: "Selecione a frequência da recorrência",
    path: ["frequency"],
  });

export type CreateGameListingInput = z.infer<typeof createGameListingSchema>;
