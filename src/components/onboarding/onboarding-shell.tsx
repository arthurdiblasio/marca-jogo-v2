"use client";

import { motion } from "motion/react";

const STEP_LABELS: Record<number, string> = {
  1: "Identificação",
  2: "Localização",
  3: "Aniversário",
  4: "Modalidade",
  5: "Posição",
  6: "Pé preferido",
  7: "Número",
  8: "Apresentação",
  9: "Telefone",
};

interface Props {
  currentStep: number;
  totalSteps: number;
  children: React.ReactNode;
}

export function OnboardingShell({ currentStep, totalSteps, children }: Props) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="flex min-h-screen flex-col">
      <header className="fixed inset-x-0 top-0 z-10 bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center gap-4 px-6 py-4">
          <div className="flex-1 overflow-hidden rounded-full bg-muted h-1.5">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
          <span className="text-xs font-semibold text-muted-foreground tabular-nums shrink-0">
            {currentStep}/{totalSteps}
          </span>
        </div>

        <div className="mx-auto max-w-lg px-6 pb-3">
          <p className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
            {STEP_LABELS[currentStep]}
          </p>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 pt-28 pb-12">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </main>

      <footer className="py-6 text-center">
        <div className="flex justify-center gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i + 1 < currentStep
                  ? "w-4 bg-primary"
                  : i + 1 === currentStep
                    ? "w-6 bg-primary"
                    : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>
      </footer>
    </div>
  );
}
