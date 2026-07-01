import { z } from "zod";

export const expressInterestSchema = z.object({
  gameListingId: z.string().cuid(),
  message: z.string().max(300).optional(),
});

export type ExpressInterestInput = z.infer<typeof expressInterestSchema>;
