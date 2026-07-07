"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";

import { saveOnboardingStep } from "@/modules/onboarding/actions/save-onboarding-step";
import { ONBOARDING_STEPS } from "@/modules/onboarding/types/onboarding";
import { OnboardingStepWrapper } from "../onboarding-step-wrapper";

type Foot = "LEFT" | "RIGHT" | "BOTH";

const OPTIONS: { value: Foot; label: string; sublabel: string }[] = [
  { value: "LEFT", label: "Canhoto", sublabel: "Pé esquerdo" },
  { value: "RIGHT", label: "Destro", sublabel: "Pé direito" },
  { value: "BOTH", label: "Ambidestro", sublabel: "Os dois pés" },
];

function FootSvg({ side, active }: { side: "left" | "right" | "both"; active: boolean }) {
  const color = active ? "var(--primary)" : "var(--muted-foreground)";
  const shadowOpacity = active ? 0.3 : 0;

  if (side === "both") {
    return (
      <svg width="64" height="40" viewBox="0 0 64 40" fill="none">
        <ellipse cx="16" cy="28" rx="12" ry="9" fill={color} opacity="0.15" />
        <ellipse cx="48" cy="28" rx="12" ry="9" fill={color} opacity="0.15" />
        <rect x="9" y="10" width="14" height="22" rx="7" fill={color} />
        <rect x="41" y="10" width="14" height="22" rx="7" fill={color} />
        <circle cx="10" cy="11" r="3" fill="var(--primary)" opacity={shadowOpacity} />
        <circle cx="54" cy="11" r="3" fill="var(--primary)" opacity={shadowOpacity} />
      </svg>
    );
  }

  const x = side === "left" ? 8 : 42;
  return (
    <svg width="64" height="40" viewBox="0 0 64 40" fill="none">
      <ellipse cx={x + 7} cy="29" rx="13" ry="9" fill={color} opacity="0.15" />
      <rect x={x} y="9" width="14" height="23" rx="7" fill={color} />
      <circle
        cx={side === "left" ? x + 1 : x + 13}
        cy="10"
        r="3.5"
        fill="var(--primary)"
        opacity={shadowOpacity}
      />
    </svg>
  );
}

export function StepFoot() {
  const [selected, setSelected] = useState<Foot | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    if (!selected) return;
    setLoading(true);
    await saveOnboardingStep(ONBOARDING_STEPS.FOOT, { preferredFoot: selected });
  }

  const footSide: Record<Foot, "left" | "right" | "both"> = {
    LEFT: "left",
    RIGHT: "right",
    BOTH: "both",
  };

  return (
    <OnboardingStepWrapper
      question="Qual é o seu pé?"
      hint="Isso ajuda a montar escalações equilibradas."
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
          {OPTIONS.map(({ value, label, sublabel }) => {
            const isSelected = selected === value;
            return (
              <motion.button
                key={value}
                type="button"
                onClick={() => setSelected(value)}
                whileTap={{ scale: 0.97 }}
                animate={isSelected ? { scale: [1, 1.02, 1] } : { scale: 1 }}
                transition={{ duration: 0.25 }}
                className={`relative flex items-center gap-5 rounded-2xl border-2 p-5 text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-muted-foreground/40"
                }`}
              >
                <motion.div
                  animate={isSelected ? { y: [0, -4, 0] } : { y: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <FootSvg side={footSide[value]} active={isSelected} />
                </motion.div>

                <div className="flex-1">
                  <p className={`text-base font-bold ${isSelected ? "text-primary" : "text-foreground"}`}>
                    {label}
                  </p>
                  <p className="text-sm text-muted-foreground">{sublabel}</p>
                </div>

                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="h-6 w-6 rounded-full bg-primary flex items-center justify-center shrink-0"
                    >
                      <svg width="12" height="9" viewBox="0 0 12 9" fill="none">
                        <path d="M1 4.5L4.5 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>

        <motion.button
          type="button"
          onClick={handleSubmit}
          disabled={!selected || loading}
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 transition disabled:opacity-40"
        >
          {loading ? "Salvando..." : "Continuar"}
          {!loading && <ArrowRight size={18} />}
        </motion.button>
      </div>
    </OnboardingStepWrapper>
  );
}
