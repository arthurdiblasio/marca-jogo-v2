"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  LockKeyhole,
  Mail,
} from "lucide-react";
import {
  useForm,
} from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { FormField } from "@/components/ui/form-field";
import { InputWithIcon } from "@/components/ui/input-with-icon";

import {
  loginUserSchema,
  type LoginUserInput,
} from "@/modules/auth/schemas/login-user-schema";

import { GoogleButton } from "./google-button";
import { PasswordInput } from "../ui/password-input";
import { loginRequest } from "@/modules/auth/services/auth-api";

export function LoginForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginUserInput>({
    resolver: zodResolver(
      loginUserSchema,
    ),
  });

  async function onSubmit(
    data: LoginUserInput,
  ) {
    try {
      await loginRequest(data);

      toast.success(
        "Login realizado com sucesso",
      );

      router.replace(
        "/dashboard",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Erro ao realizar login",
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
          errors.password
            ?.message
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

      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="
            text-sm
            font-medium
            text-green-600
            transition-colors
            hover:text-green-700
          "
        >
          Esqueci minha senha
        </Link>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting
          ? "Entrando..."
          : "Entrar"}
      </Button>

      <p className="text-center text-sm text-slate-600">
        Ainda não possui conta?{" "}
        <Link
          href="/register"
          className="
            font-semibold
            text-green-600
            transition-colors
            hover:text-green-700
          "
        >
          Criar conta
        </Link>
      </p>
    </form>
  );
}