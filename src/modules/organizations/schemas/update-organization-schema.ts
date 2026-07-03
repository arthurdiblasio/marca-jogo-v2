import { z } from "zod";

export const updateOrganizationSchema = z.object({
  organizationId: z.string(),
  name: z
    .string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .max(60, "Nome muito longo"),
  modality: z
    .enum(["FIELD_11", "SOCIETY_7", "SOCIETY_8", "FUTSAL_5"])
    .optional(),
  logoUrl: z.string().max(500).optional(),
  address: z.string().max(200).optional(),
  city: z.string().max(60).optional(),
  state: z.string().max(2).optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  description: z.string().max(200).optional(),
  weekday: z.number().int().min(0).max(6).optional(),
  scheduledTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Horário inválido")
    .optional(),
  monthlyFee: z.number().min(0).optional(),
  singleFee: z.number().min(0).optional(),
});

export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;
