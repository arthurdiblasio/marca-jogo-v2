import { LabelHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export function Label({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "block text-xs font-semibold uppercase tracking-widest text-slate-400",
        className,
      )}
      {...props}
    />
  );
}