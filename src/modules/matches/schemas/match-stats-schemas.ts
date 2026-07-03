import { z } from "zod";

const playerStatEntrySchema = z.object({
  kind: z.enum(["user", "guest"]),
  id: z.string(),
  goals: z.number().int().min(0).max(99),
  assists: z.number().int().min(0).max(99),
});

export const saveMatchPlayerStatsSchema = z.object({
  matchId: z.string(),
  stats: z.array(playerStatEntrySchema),
});

export type SaveMatchPlayerStatsInput = z.infer<typeof saveMatchPlayerStatsSchema>;

export const removeMatchPlayerStatSchema = z.object({
  matchId: z.string(),
  kind: z.enum(["user", "guest"]),
  id: z.string(),
});

export type RemoveMatchPlayerStatInput = z.infer<typeof removeMatchPlayerStatSchema>;

export const submitMatchVoteSchema = z.object({
  matchId: z.string(),
  mvpUserId: z.string(),
  ratings: z.array(
    z.object({
      ratedUserId: z.string(),
      rating: z.number().int().min(1).max(5),
    }),
  ),
});

export type SubmitMatchVoteInput = z.infer<typeof submitMatchVoteSchema>;
