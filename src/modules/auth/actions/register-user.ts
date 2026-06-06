import { userRepository } from "../repositories/user-repository";
import { RegisterUserInput } from "../schemas/register-user-schema";
import { passwordHasher } from "../services/password-hasher";

export async function registerUser(data: RegisterUserInput) {
  const existingUser = await userRepository.findByEmail(data.email);

  if (existingUser) {
    throw new Error("Email already exists");
  }

  const passwordHash = await passwordHasher.hash(data.password);

  return userRepository.create({
    email: data.email,
    passwordHash,
    fullName: data.fullName,
  });
}
