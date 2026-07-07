import { cn } from "@/lib/utils";

interface Props {
  question: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function OnboardingStepWrapper({ question, hint, children, className }: Props) {
  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground">
          {question}
        </h1>
        {hint && (
          <p className="text-sm text-muted-foreground">{hint}</p>
        )}
      </div>
      {children}
    </div>
  );
}
