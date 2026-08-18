"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Check, Goal, Users, UsersRound, Volleyball } from "lucide-react";

import { saveOnboardingStep } from "@/modules/onboarding/actions/save-onboarding-step";
import { ONBOARDING_STEPS } from "@/modules/onboarding/types/onboarding";
import { ALL_MODALITIES, type SportModality } from "@/constants/positions";

const MODALITY_ICON: Record<SportModality, typeof Goal> = {
  FIELD_11: Goal,
  SOCIETY_7: Users,
  SOCIETY_8: UsersRound,
  FUTSAL_5: Volleyball,
};

const MODALITY_DESC: Record<SportModality, string> = {
  FIELD_11: "Grama · 11 jogadores",
  SOCIETY_7: "Society · 7 jogadores",
  SOCIETY_8: "Society · 8 jogadores",
  FUTSAL_5: "Quadra · 5 jogadores",
};

export function StepModality() {
  const [selected, setSelected] = useState<SportModality[]>([]);
  const [loading, setLoading] = useState(false);

  function toggle(value: SportModality) {
    setSelected((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }

  async function handleSubmit() {
    if (selected.length === 0) return;
    setLoading(true);
    await saveOnboardingStep(ONBOARDING_STEPS.MODALITY, { modalities: selected });
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground">
          Em quais modalidades você joga?
        </h1>
        <p className="text-sm text-muted-foreground">Pode escolher mais de uma.</p>
      </div>

      <div className="flex flex-col gap-3">
        {ALL_MODALITIES.map(({ value, label }) => {
          const isSelected = selected.includes(value);
          const ModalityIcon = MODALITY_ICON[value];
          return (
            <motion.button
              key={value}
              type="button"
              onClick={() => toggle(value)}
              whileTap={{ scale: 0.97 }}
              className={`relative flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all ${
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card hover:border-muted-foreground/40"
              }`}
            >
              <ModalityIcon
                className={`size-8 shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"}`}
              />

              <div className="flex-1">
                <p className={`text-sm font-bold ${isSelected ? "text-primary" : "text-foreground"}`}>
                  {label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{MODALITY_DESC[value]}</p>
              </div>

              <div
                className={`h-6 w-6 rounded-full border-2 transition-all flex items-center justify-center shrink-0 ${
                  isSelected ? "border-primary bg-primary" : "border-border"
                }`}
              >
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <Check className="size-3 text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          );
        })}
      </div>

      <motion.button
        type="button"
        onClick={handleSubmit}
        disabled={selected.length === 0 || loading}
        whileTap={{ scale: 0.97 }}
        className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/20 transition disabled:opacity-40"
      >
        {loading
          ? "Salvando..."
          : `Continuar com ${selected.length > 0 ? selected.length : ""} ${selected.length === 1 ? "modalidade" : selected.length > 1 ? "modalidades" : "modalidade"}`}
        {!loading && <ArrowRight size={18} />}
      </motion.button>
    </div>
  );
}
