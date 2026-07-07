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
      <h2 className="text-xl font-bold text-foreground">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-1 text-sm text-muted-foreground">
          {subtitle}
        </p>
      )}
    </div>
  );
}