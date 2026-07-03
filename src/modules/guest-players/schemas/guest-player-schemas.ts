import { z } from "zod";

export const createGuestPlayerSchema = z.object({
  organizationId: z.string(),
  name: z.string().min(2, "Informe um nome").max(60),
});

export type CreateGuestPlayerInput = z.infer<typeof createGuestPlayerSchema>;

export const mergeGuestPlayerSchema = z.object({
  guestPlayerId: z.string(),
  userId: z.string(),
});

export type MergeGuestPlayerInput = z.infer<typeof mergeGuestPlayerSchema>;
