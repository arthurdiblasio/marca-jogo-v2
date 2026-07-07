import { InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export function Input({ className, hasError, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border-2 bg-card px-4 py-4 text-base font-medium text-foreground",
        "placeholder:text-muted-foreground/60 outline-none transition",
        hasError
          ? "border-red-400 focus:border-red-400"
          : "border-border focus:border-primary",
        className,
      )}
      {...props}
    />
  );
}
