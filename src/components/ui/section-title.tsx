import { ReactNode } from "react";

interface SectionTitleProps {
  title: string;
  subtitle?: ReactNode;
}

export function SectionTitle({
  title,
  subtitle,
}: SectionTitleProps) {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-1 text-sm text-slate-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}