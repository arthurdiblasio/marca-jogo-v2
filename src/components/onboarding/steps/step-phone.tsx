"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, SkipForward } from "lucide-react";

import { saveOnboardingStep } from "@/modules/onboarding/actions/save-onboarding-step";
import { ONBOARDING_STEPS } from "@/modules/onboarding/types/onboarding";
import { formatPhoneInput, isValidBrPhone } from "@/lib/phone";
import { OnboardingStepWrapper } from "../onboarding-step-wrapper";

export function StepPhone() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid = isValidBrPhone(phone);

  async function handleSubmit(skip = false) {
    setLoading(true);
    await saveOnboardingStep(
      ONBOARDING_STEPS.PHONE,
      skip ? {} : { phone: phone.replace(/\D/g, "") },
    );
  }

  return (
    <OnboardingStepWrapper
      question="Qual é o seu celular?"
      hint="Assim outros jogadores conseguem te chamar direto no WhatsApp."
    >
      <div className="flex flex-col gap-5">
        <input
          type="tel"
          inputMode="numeric"
          value={phone}
          onChange={(e) => setPhone(formatPhoneInput(e.target.value))}
          placeholder="(11) 91234-5678"
          autoFocus
          className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-4 text-lg font-medium text-slate-900 placeholder:text-slate-300 outline-none transition focus:border-[#16A34A]"
        />

        <div className="flex flex-col gap-3">
          <motion.button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={!isValid || loading}
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
