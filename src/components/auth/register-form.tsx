"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, User } from "lucide-react";
import {
  useForm,
} from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { FormField } from "@/components/ui/form-field";
import { InputWithIcon } from "@/components/ui/input-with-icon";

import {
  registerUserSchema,
  type RegisterUserInput,
} from "@/modules/auth/schemas/register-user-schema";

import { GoogleButton } from "./google-button";
import { registerRequest } from "@/modules/auth/services/auth-api";
import { PasswordInput } from "../ui/password-input";

export function RegisterForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<RegisterUserInput>({
    resolver: zodResolver(
      registerUserSchema,
    ),
  });

  async function onSubmit(
    data: RegisterUserInput,
  ) {
    try {
      await registerRequest(data);

      toast.success(
        "Conta criada com sucesso!",
      );

      router.push("/login");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao criar conta",
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit(
        onSubmit,
      )}
      className="space-y-5"
    >
      <GoogleButton />

      <Divider />

      <FormField
        label="Nome Completo"
        htmlFor="fullName"
        error={
          errors.fullName?.message
        }
      >
        <InputWithIcon
          id="fullName"
          icon={
            <User className="h-4 w-4" />
          }
          placeholder="Seu nome completo"
          hasError={
            !!errors.fullName
          }
          {...register(
            "fullName",
          )}
        />
      </FormField>

      <FormField
        label="Email"
        htmlFor="email"
        error={
          errors.email?.message
        }
      >
        <InputWithIcon
          id="email"
          type="email"
          icon={
            <Mail className="h-4 w-4" />
          }
          placeholder="voce@email.com"
          hasError={
            !!errors.email
          }
          {...register("email")}
        />
      </FormField>

      <FormField
        label="Senha"
        htmlFor="password"
        error={
          errors.password?.message
        }
      >
        <PasswordInput
          id="password"
          placeholder="********"
          hasError={
            !!errors.password
          }
          {...register("password")}
        />
      </FormField>

      <FormField
        label="Confirmar Senha"
        htmlFor="confirmPassword"
        error={
          errors
            .confirmPassword
            ?.message
        }
      >
        <PasswordInput
          id="confirmPassword"
          placeholder="********"
          hasError={
            !!errors.confirmPassword
          }
          {...register("confirmPassword")}
        />
      </FormField>

      <Button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Criando conta..."
          : "Criar Conta"}
      </Button>

      <p className="text-center text-sm text-slate-600">
        Já possui uma conta?{" "}
        <Link
          href="/login"
          className="
            font-semibold
            text-green-600
            hover:text-green-700
          "
        >
          Entrar
        </Link>
      </p>
    </form>
  );
}