"use client";

import {
  InputHTMLAttributes,
  useState,
} from "react";

import {
  Eye,
  EyeOff,
  LockKeyhole,
} from "lucide-react";

import { cn } from "@/lib/cn";

interface PasswordInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export function PasswordInput({
  className,
  hasError,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] =
    useState(false);

  return (
    <div
      className={cn(
        "flex h-12 items-center rounded-lg border bg-white px-3 transition",

        hasError
          ? "border-red-500"
          : "border-slate-300 focus-within:border-green-600",
      )}
    >
      <LockKeyhole className="mr-3 h-4 w-4 text-slate-400" />

      <input
        type={
          showPassword
            ? "text"
            : "password"
        }
        className={cn(
          "h-full w-full bg-transparent text-sm outline-none",
          className,
        )}
        {...props}
      />

      <button
        type="button"
        onClick={() =>
          setShowPassword(
            (prev) => !prev,
          )
        }
        className="
          text-slate-400
          transition
          hover:text-slate-600
        "
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}