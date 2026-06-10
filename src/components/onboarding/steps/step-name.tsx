"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

import { saveOnboardingStep } from "@/modules/onboarding/actions/save-onboarding-step";
import { ONBOARDING_STEPS } from "@/modules/onboarding/types/onboarding";
import { OnboardingStepWrapper } from "../onboarding-step-wrapper";

export function StepName() {
  const [fullName, setFullName] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);

  const canContinue = fullName.trim().length >= 2;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canContinue) return;
    setLoading(true);
    await saveOnboardingStep(ONBOARDING_STEPS.NAME, {
      fullName: fullName.trim(),
      nickname: nickname.trim() || undefined,
    });
  }

  return (
    <OnboardingStepWrapper
      question="Como você quer ser chamado?"
      hint="Esse nome vai aparecer para os outros jogadores."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Nome completo
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Ex: Bruno Costa"
            autoFocus
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-4 text-lg font-medium text-slate-900 placeholder:text-slate-300 outline-none transition focus:border-[#16A34A]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Apelido <span className="normal-case font-normal text-slate-300">(opcional)</span>
          </label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Ex: Bruninho"
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-4 text-lg font-medium text-slate-900 placeholder:text-slate-300 outline-none transition focus:border-[#16A34A]"
          />
        </div>

        <motion.button
          type="submit"
          disabled={!canContinue || loading}
          whileTap={{ scale: 0.97 }}
          className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#16A34A] px-6 py-4 text-base font-bold text-white shadow-lg shadow-green-200 transition disabled:opacity-40"
        >
          {loading ? "Salvando..." : "Continuar"}
          {!loading && <ArrowRight size={18} />}
        </motion.button>
      </form>
    </OnboardingStepWrapper>
  );
}
