import { InputHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/cn";

interface InputWithIconProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: ReactNode;
  hasError?: boolean;
}

export function InputWithIcon({ icon, className, hasError, ...props }: InputWithIconProps) {
  return (
    <div
      className={cn(
        "flex items-center rounded-xl border-2 bg-white px-4 transition",
        hasError
          ? "border-red-400 focus-within:border-red-400"
          : "border-slate-200 focus-within:border-[#16A34A]",
      )}
    >
      <div className="mr-3 shrink-0 text-slate-400">{icon}</div>
      <input
        className={cn(
          "w-full bg-transparent py-4 text-base font-medium text-slate-900",
          "placeholder:text-slate-300 outline-none",
          className,
        )}
        {...props}
      />
    </div>
  );
}
