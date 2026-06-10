"use client";

import { InputHTMLAttributes, useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

import { cn } from "@/lib/cn";

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export function PasswordInput({ className, hasError, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className={cn(
        "flex items-center rounded-xl border-2 bg-white px-4 transition",
        hasError
          ? "border-red-400 focus-within:border-red-400"
          : "border-slate-200 focus-within:border-[#16A34A]",
      )}
    >
      <LockKeyhole className="mr-3 h-4 w-4 shrink-0 text-slate-400" />

      <input
        type={showPassword ? "text" : "password"}
        className={cn(
          "w-full bg-transparent py-4 text-base font-medium text-slate-900",
          "placeholder:text-slate-300 outline-none",
          className,
        )}
        {...props}
      />

      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="ml-3 shrink-0 text-slate-400 transition hover:text-slate-600"
      >
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}
