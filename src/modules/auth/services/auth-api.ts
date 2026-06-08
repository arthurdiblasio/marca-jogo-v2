import type { LoginUserInput } from "../schemas/login-user-schema";
import { RegisterUserInput } from "../schemas/register-user-schema";

export async function loginRequest(data: LoginUserInput) {
  const response = await fetch("/api/auth/login", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message ?? "Erro ao realizar login");
  }

  return result;
}

export async function registerRequest(data: RegisterUserInput) {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
}

export async function logoutRequest() {
  const response = await fetch("/api/auth/logout", {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Erro ao realizar logout");
  }
}
