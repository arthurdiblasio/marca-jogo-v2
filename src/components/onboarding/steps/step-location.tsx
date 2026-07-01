"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight, ChevronDown, Loader2, SkipForward } from "lucide-react";

import { saveOnboardingStep } from "@/modules/onboarding/actions/save-onboarding-step";
import { ONBOARDING_STEPS } from "@/modules/onboarding/types/onboarding";
import { fetchStates, fetchCitiesByState } from "@/constants/brazil-locations";
import { OnboardingStepWrapper } from "../onboarding-step-wrapper";

export function StepLocation() {
  const [states, setStates] = useState<{ value: string; label: string }[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);
  const [saving, setSaving] = useState(false);

  const canContinue = state.length === 2 && city.length > 0;

  useEffect(() => {
    fetchStates()
      .then(setStates)
      .finally(() => setLoadingStates(false));
  }, []);

  useEffect(() => {
    if (!state) {
      setCities([]);
      return;
    }
    setLoadingCities(true);
    setCity("");
    fetchCitiesByState(state)
      .then(setCities)
      .finally(() => setLoadingCities(false));
  }, [state]);

  async function handleSubmit(skip = false) {
    setSaving(true);
    await saveOnboardingStep(ONBOARDING_STEPS.LOCATION, skip ? {} : { city, state });
  }

  const selectClass = "w-full appearance-none rounded-xl border-2 border-slate-200 bg-white px-4 py-4 text-lg font-medium text-slate-900 outline-none transition focus:border-[#16A34A] disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <OnboardingStepWrapper
      question="Onde você joga?"
      hint="Usaremos sua cidade para conectar você a jogadores da região."
    >
      <div className="flex flex-col gap-5">

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Estado
          </label>
          <div className="relative">
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              disabled={loadingStates}
              className={selectClass}
            >
              <option value="">
                {loadingStates ? "Carregando estados..." : "Selecione o estado"}
              </option>
              {states.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label} ({s.value})
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              {loadingStates
                ? <Loader2 className="h-5 w-5 animate-spin" />
                : <ChevronDown className="h-5 w-5" />
              }
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Cidade
          </label>
          <div className="relative">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={!state || loadingCities}
              className={selectClass}
            >
              <option value="">
                {loadingCities
                  ? "Carregando cidades..."
                  : state
                    ? "Selecione a cidade"
                    : "Selecione o estado primeiro"}
              </option>
              {cities.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              {loadingCities
                ? <Loader2 className="h-5 w-5 animate-spin" />
                : <ChevronDown className="h-5 w-5" />
              }
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-2">
          <motion.button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={!canContinue || saving}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#16A34A] px-6 py-4 text-base font-bold text-white shadow-lg shadow-green-200 transition disabled:opacity-40"
          >
            {saving ? "Salvando..." : "Continuar"}
            {!saving && <ArrowRight size={18} />}
          </motion.button>

          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={saving}
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
