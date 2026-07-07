"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, SkipForward } from "lucide-react";

import { saveOnboardingStep } from "@/modules/onboarding/actions/save-onboarding-step";
import { ONBOARDING_STEPS } from "@/modules/onboarding/types/onboarding";
import { OnboardingStepWrapper } from "../onboarding-step-wrapper";

export function StepBirthdate() {
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid = Boolean(date) && new Date(date) < new Date();

  async function handleSubmit(skip = false) {
    setLoading(true);
    await saveOnboardingStep(ONBOARDING_STEPS.BIRTHDATE, skip ? {} : {
      birthDate: new Date(date).toISOString(),
    });
  }

  return (
    <OnboardingStepWrapper
      question="Quando você nasceu?"
      hint="Sua idade aparece no seu perfil público."
    >
      <div className="flex flex-col gap-5">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={new Date().toISOString().split("T")[0]}
          autoFocus
          className="w-full rounded-xl border-2 border-border bg-card px-4 py-4 text-lg font-medium text-foreground outline-none transition focus:border-primary"
        />

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
