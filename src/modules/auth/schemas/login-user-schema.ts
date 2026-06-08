import { z } from "zod";

export const loginUserSchema = z.object({
  email: z.email("Email inválido").transform((email) => email.toLowerCase()),
  password: z.string().min(1, "Informe sua senha"),
});

export type LoginUserInput = z.infer<typeof loginUserSchema>;
