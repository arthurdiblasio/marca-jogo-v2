import { z } from "zod";

export const createPeladaOccurrenceSchema = z.object({
  organizationId: z.string(),
  title: z.string().min(3, "Informe um título").max(80),
  scheduledAt: z.string().min(1, "Informe a data e hora"),
  location: z.string().min(3, "Informe o local").max(200),
});

export type CreatePeladaOccurrenceInput = z.infer<typeof createPeladaOccurrenceSchema>;

const playerStatEntrySchema = z.object({
  kind: z.enum(["user", "guest"]),
  id: z.string(),
  goals: z.number().int().min(0).max(99),
  assists: z.number().int().min(0).max(99),
});

export const savePeladaPlayerStatsSchema = z.object({
  peladaOccurrenceId: z.string(),
  stats: z.array(playerStatEntrySchema),
});

export type SavePeladaPlayerStatsInput = z.infer<typeof savePeladaPlayerStatsSchema>;

export const removePeladaPlayerStatSchema = z.object({
  peladaOccurrenceId: z.string(),
  kind: z.enum(["user", "guest"]),
  id: z.string(),
});

export type RemovePeladaPlayerStatInput = z.infer<typeof removePeladaPlayerStatSchema>;

export const submitPeladaVoteSchema = z.object({
  peladaOccurrenceId: z.string(),
  mvpUserId: z.string(),
  ratings: z.array(
    z.object({
      ratedUserId: z.string(),
      rating: z.number().int().min(1).max(5),
    }),
  ),
});

export type SubmitPeladaVoteInput = z.infer<typeof submitPeladaVoteSchema>;
