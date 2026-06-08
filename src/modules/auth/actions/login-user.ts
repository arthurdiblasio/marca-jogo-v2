import type { LoginUserInput } from "../schemas/login-user-schema";

import { userRepository } from "../repositories/user-repository";
import { passwordHasher } from "../services/password-hasher";

export async function loginUser(data: LoginUserInput) {
  const user = await userRepository.findByEmail(data.email);

  if (!user) {
    throw new Error("Email ou senha inválidos");
  }

  if (!user.passwordHash) {
    throw new Error("Esta conta utiliza login com Google");
  }

  const passwordMatches = await passwordHasher.compare(
    data.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw new Error("Email ou senha inválidos");
  }

  return user;
}
