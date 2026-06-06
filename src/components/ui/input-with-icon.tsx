import {
  InputHTMLAttributes,
  ReactNode,
} from "react";

import { cn } from "@/lib/cn";

interface InputWithIconProps
  extends InputHTMLAttributes<HTMLInputElement> {
  icon: ReactNode;
  hasError?: boolean;
}

export function InputWithIcon({
  icon,
  className,
  hasError,
  ...props
}: InputWithIconProps) {
  return (
    <div
      className={cn(
        "flex h-12 items-center rounded-lg border bg-white px-3 transition",

        hasError
          ? "border-red-500"
          : "border-slate-300 focus-within:border-green-600",
      )}
    >
      <div className="mr-3 text-slate-400">
        {icon}
      </div>

      <input
        className={cn(
          "h-full w-full bg-transparent text-sm outline-none",
          className,
        )}
        {...props}
      />
    </div>
  );
}