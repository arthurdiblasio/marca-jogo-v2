"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, SkipForward } from "lucide-react";

import { saveOnboardingStep } from "@/modules/onboarding/actions/save-onboarding-step";
import { ONBOARDING_STEPS } from "@/modules/onboarding/types/onboarding";
import { OnboardingStepWrapper } from "../onboarding-step-wrapper";

const MAX_CHARS = 160;

export function StepBio() {
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  const remaining = MAX_CHARS - bio.length;

  async function handleSubmit(skip = false) {
    setLoading(true);
    await saveOnboardingStep(ONBOARDING_STEPS.BIO, skip ? {} : {
      bio: bio.trim() || undefined,
    });
  }

  return (
    <OnboardingStepWrapper
      question="Conte sobre você."
      hint="Uma frase sobre seu estilo de jogo. Pode pular."
    >
      <div className="flex flex-col gap-5">
        <div className="relative">
          <textarea
            value={bio}
            onChange={(e) => {
              if (e.target.value.length <= MAX_CHARS) setBio(e.target.value);
            }}
            placeholder="Ex: Meia criativo, gosto de ajudar na saída de bola..."
            rows={4}
            autoFocus
            className="w-full resize-none rounded-xl border-2 border-border bg-card px-4 py-4 text-base font-medium text-foreground placeholder:text-muted-foreground/60 outline-none transition focus:border-primary"
          />
          <span className={`absolute bottom-3 right-4 text-xs tabular-nums ${remaining < 20 ? "text-amber-500" : "text-muted-foreground/60"}`}>
            {remaining}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <motion.button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={loading}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 transition disabled:opacity-40"
          >
            {loading ? "Finalizando..." : "Concluir perfil"}
            {!loading && <ArrowRight size={18} />}
          </motion.button>

          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition"
          >
            <SkipForward size={14} />
            Pular e concluir
          </button>
        </div>
      </div>
    </OnboardingStepWrapper>
  );
}
