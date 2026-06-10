"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, SkipForward } from "lucide-react";

import { saveOnboardingStep } from "@/modules/onboarding/actions/save-onboarding-step";
import { ONBOARDING_STEPS } from "@/modules/onboarding/types/onboarding";
import { OnboardingStepWrapper } from "../onboarding-step-wrapper";

const STATES = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
  "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC",
  "SP","SE","TO",
];

export function StepLocation() {
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [loading, setLoading] = useState(false);

  const canContinue = city.trim().length >= 2 && state.length === 2;

  async function handleSubmit(skip = false) {
    setLoading(true);
    await saveOnboardingStep(ONBOARDING_STEPS.LOCATION, skip ? {} : {
      city: city.trim(),
      state,
    });
  }

  return (
    <OnboardingStepWrapper
      question="Onde você joga?"
      hint="Usaremos sua cidade para conectar você a jogadores da região."
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Cidade
          </label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Ex: Belo Horizonte"
            autoFocus
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-4 text-lg font-medium text-slate-900 placeholder:text-slate-300 outline-none transition focus:border-[#16A34A]"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Estado
          </label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-4 text-lg font-medium text-slate-900 outline-none transition focus:border-[#16A34A] appearance-none"
          >
            <option value="">Selecione</option>
            {STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-3 mt-2">
          <motion.button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={!canContinue || loading}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#16A34A] px-6 py-4 text-base font-bold text-white shadow-lg shadow-green-200 transition disabled:opacity-40"
          >
            {loading ? "Salvando..." : "Continuar"}
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
    </OnboardingStepWrapper>
  );
}
