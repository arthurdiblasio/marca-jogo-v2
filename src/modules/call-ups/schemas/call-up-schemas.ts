import { z } from "zod";

export const callUpPlayersSchema = z.object({
  userIds: z.array(z.string()).min(1, "Selecione ao menos um jogador"),
  slots: z.number().int().positive().nullable().optional(),
});

export const callUpPeladaPlayersSchema = callUpPlayersSchema.extend({
  peladaOccurrenceId: z.string(),
});

export type CallUpPeladaPlayersInput = z.infer<typeof callUpPeladaPlayersSchema>;

export const callUpMatchPlayersSchema = callUpPlayersSchema.extend({
  matchId: z.string(),
  organizationId: z.string(),
});

export type CallUpMatchPlayersInput = z.infer<typeof callUpMatchPlayersSchema>;

export const respondCallUpSchema = z.object({
  id: z.string(),
  kind: z.enum(["pelada", "match"]),
  status: z.enum(["ACCEPTED", "DECLINED"]),
});

export type RespondCallUpInput = z.infer<typeof respondCallUpSchema>;
