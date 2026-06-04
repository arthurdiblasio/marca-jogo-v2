import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
};

export function PageHeader({ eyebrow, title, description, className }: PageHeaderProps) {
  return (
    <header className={cn("border-b pb-4", className)}>
      {eyebrow ? <p className="caption text-primary">{eyebrow}</p> : null}
      <h1 className="heading-lg mt-1 max-w-3xl">{title}</h1>
      {description ? <p className="body-md max-w-2xl text-muted-foreground">{description}</p> : null}
    </header>
  );
}
