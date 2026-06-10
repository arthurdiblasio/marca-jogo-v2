import { z } from "zod";

export const createOrganizationSchema = z.object({
  type: z.enum(["PELADA", "TEAM"]),
  name: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(60, "Nome muito longo"),
  modality: z
    .enum(["FIELD_11", "SOCIETY_7", "SOCIETY_8", "FUTSAL_5"])
    .optional(),
  city: z.string().max(60).optional(),
  state: z.string().max(2).optional(),
  description: z.string().max(200).optional(),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
