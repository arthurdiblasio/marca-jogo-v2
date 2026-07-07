"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, SkipForward } from "lucide-react";

import { saveOnboardingStep } from "@/modules/onboarding/actions/save-onboarding-step";
import { ONBOARDING_STEPS } from "@/modules/onboarding/types/onboarding";
import { OnboardingStepWrapper } from "../onboarding-step-wrapper";

export function StepShirt() {
  const [number, setNumber] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const parsed = parseInt(number, 10);
  const isValid = !isNaN(parsed) && parsed >= 1 && parsed <= 99;

  async function handleSubmit(skip = false) {
    setLoading(true);
    await saveOnboardingStep(ONBOARDING_STEPS.SHIRT, skip ? {} : {
      shirtNumber: parsed,
    });
  }

  return (
    <OnboardingStepWrapper
      question="Qual é o seu número?"
      hint="O número da sua camisa dentro das organizações."
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
              <path
                d="M50 20L30 40V70H50V140H110V70H130V40L110 20H95C95 28.28 88.28 35 80 35C71.72 35 65 28.28 65 20H50Z"
                fill="#111827"
                stroke="#1F2937"
                strokeWidth="2"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pt-10">
              <AnimatePresence mode="wait">
                <motion.span
                  key={number || "empty"}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.18 }}
                  className="text-5xl font-extrabold text-white tabular-nums"
                >
                  {isValid ? parsed : "?"}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            min={1}
            max={99}
            placeholder="1–99"
            autoFocus
            className="w-32 rounded-xl border-2 border-border bg-card px-4 py-3 text-center text-2xl font-bold text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-primary [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
        </div>

        <div className="flex flex-col gap-3">
          <motion.button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={!isValid || loading}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 transition disabled:opacity-40"
          >
            {loading ? "Salvando..." : "Continuar"}
            {!loading && <ArrowRight size={18} />}
          </motion.button>

          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <SkipForward size={14} />
            Pular por agora
          </button>
        </div>
      </div>
    </OnboardingStepWrapper>
  );
}
