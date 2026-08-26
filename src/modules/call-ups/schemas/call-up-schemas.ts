import { z } from "zod";

export const callUpMatchPlayersSchema = z.object({
  matchId: z.string(),
  organizationId: z.string(),
  userIds: z.array(z.string()).min(1, "Selecione ao menos um jogador"),
  slots: z.number().int().positive().nullable().optional(),
});

export type CallUpMatchPlayersInput = z.infer<typeof callUpMatchPlayersSchema>;

export const respondCallUpSchema = z.object({
  id: z.string(),
  status: z.enum(["ACCEPTED", "DECLINED"]),
});

export type RespondCallUpInput = z.infer<typeof respondCallUpSchema>;
