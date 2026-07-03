"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, SkipForward } from "lucide-react";

import { saveOnboardingStep } from "@/modules/onboarding/actions/save-onboarding-step";
import { ONBOARDING_STEPS } from "@/modules/onboarding/types/onboarding";
import { AddressAutocomplete, type AddressSelection } from "@/components/ui/address-autocomplete";
import { OnboardingStepWrapper } from "../onboarding-step-wrapper";

export function StepLocation() {
  const [selection, setSelection] = useState<AddressSelection | null>(null);
  const [saving, setSaving] = useState(false);

  const canContinue = !!selection;

  async function handleSubmit(skip = false) {
    setSaving(true);
    await saveOnboardingStep(
      ONBOARDING_STEPS.LOCATION,
      skip || !selection
        ? {}
        : {
            address: selection.address,
            city: selection.city,
            state: selection.state,
            lat: selection.lat,
            lng: selection.lng,
          },
    );
  }

  return (
    <OnboardingStepWrapper
      question="Onde você joga?"
      hint="Usaremos seu endereço para conectar você a jogadores da região."
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
            Endereço
          </label>
          <AddressAutocomplete
            id="address"
            placeholder="Digite seu endereço ou bairro"
            onSelect={setSelection}
          />
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
