import {
  InputHTMLAttributes,
} from "react";

import { cn } from "@/lib/cn";

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export function Input({
  className,
  hasError,
  ...props
}: InputProps) {
  return (
    <input
      className={cn(
        "h-12 w-full rounded-lg border bg-white px-4 text-sm",
        "outline-none transition",

        hasError
          ? "border-red-500"
          : "border-slate-300 focus:border-green-600",

        className,
      )}
      {...props}
    />
  );
}