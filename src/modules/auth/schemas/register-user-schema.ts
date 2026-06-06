import { z } from "zod";

export const registerUserSchema = z
  .object({
    fullName: z.string().trim().min(3, "Informe seu nome"),

    email: z.email("Email inválido").transform((email) => email.toLowerCase()),

    password: z.string().min(8, "A senha deve possuir pelo menos 8 caracteres"),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não coincidem",
  });

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
