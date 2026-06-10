import { InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export function Input({ className, hasError, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border-2 bg-white px-4 py-4 text-base font-medium text-slate-900",
        "placeholder:text-slate-300 outline-none transition",
        hasError
          ? "border-red-400 focus:border-red-400"
          : "border-slate-200 focus:border-[#16A34A]",
        className,
      )}
      {...props}
    />
  );
}
