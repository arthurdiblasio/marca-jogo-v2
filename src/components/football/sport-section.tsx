import { cn } from "@/lib/utils";

type SportSectionProps = {
  title: string;
  action?: string;
  children: React.ReactNode;
  className?: string;
};

export function SportSection({ title, action, children, className }: SportSectionProps) {
  return (
    <section className={cn("sport-section overflow-hidden rounded-lg", className)}>
      <div className="flex h-12 items-center justify-between border-b px-4">
        <h2 className="text-[0.8rem] font-black uppercase text-foreground">{title}</h2>
        {action ? <span className="text-xs font-black text-primary">{action}</span> : null}
      </div>
      {children}
    </section>
  );
}
