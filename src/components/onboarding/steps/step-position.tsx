"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, SkipForward } from "lucide-react";

import { saveOnboardingStep } from "@/modules/onboarding/actions/save-onboarding-step";
import { ONBOARDING_STEPS } from "@/modules/onboarding/types/onboarding";
import { POSITIONS_BY_MODALITY, ALL_MODALITIES, type SportModality } from "@/constants/positions";
import { OnboardingStepWrapper } from "../onboarding-step-wrapper";

interface Props {
  selectedModalities: SportModality[];
}

export function StepPosition({ selectedModalities }: Props) {
  const [selections, setSelections] = useState<Record<string, string[]>>(
    Object.fromEntries(selectedModalities.map((m) => [m, []])),
  );
  const [loading, setLoading] = useState(false);

  function toggle(modality: string, position: string) {
    setSelections((prev) => {
      const current = prev[modality] ?? [];
      return {
        ...prev,
        [modality]: current.includes(position)
          ? current.filter((p) => p !== position)
          : [...current, position],
      };
    });
  }

  const totalSelected = Object.values(selections).flat().length;

  async function handleSubmit(skip = false) {
    setLoading(true);
    await saveOnboardingStep(ONBOARDING_STEPS.POSITION, skip ? { positions: {} } : {
      positions: selections,
    });
  }

  const modalityLabel = Object.fromEntries(
    ALL_MODALITIES.map(({ value, label }) => [value, label]),
  );

  if (selectedModalities.length === 0) {
    return (
      <OnboardingStepWrapper
        question="Quais posições você joga?"
        hint="Escolha as modalidades no passo anterior para ver as opções."
      >
        <button
          type="button"
          onClick={() => handleSubmit(true)}
          className="text-sm text-slate-400 hover:text-slate-600 transition underline"
        >
          Pular esta etapa
        </button>
      </OnboardingStepWrapper>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-900">
          Quais posições você joga?
        </h1>
        <p className="text-sm text-slate-500">Pode escolher mais de uma por modalidade.</p>
      </div>

      <div className="flex flex-col gap-7">
        {selectedModalities.map((modality) => {
          const positions = POSITIONS_BY_MODALITY[modality];
          const picked = selections[modality] ?? [];

          return (
            <div key={modality} className="flex flex-col gap-3">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                {modalityLabel[modality]}
              </p>
              <div className="flex flex-wrap gap-2">
                {positions.map((pos) => {
                  const isSelected = picked.includes(pos);
                  return (
                    <motion.button
                      key={pos}
                      type="button"
                      onClick={() => toggle(modality, pos)}
                      whileTap={{ scale: 0.93 }}
                      className={`rounded-xl border-2 px-4 py-2.5 text-sm font-bold transition-all ${
                        isSelected
                          ? "border-[#16A34A] bg-[#16A34A] text-white"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {pos}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        <motion.button
          type="button"
          onClick={() => handleSubmit(false)}
          disabled={totalSelected === 0 || loading}
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#16A34A] px-6 py-4 text-base font-bold text-white shadow-lg shadow-green-200 transition disabled:opacity-40"
        >
          {loading ? "Salvando..." : `Continuar${totalSelected > 0 ? ` com ${totalSelected} posição${totalSelected > 1 ? "s" : ""}` : ""}`}
          {!loading && <ArrowRight size={18} />}
        </motion.button>

        <button
          type="button"
          onClick={() => handleSubmit(true)}
          disabled={loading}
          className="flex items-center justify-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 transition"
        >
          <SkipForward size={14} />
          Pular por agora
        </button>
      </div>
    </div>
  );
}
