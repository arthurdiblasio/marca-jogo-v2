"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Swords, ChevronRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { ALL_MODALITIES } from "@/constants/positions";
import { createOrganizationAction } from "@/modules/organizations/actions/create-organization";
import {
  createOrganizationSchema,
  type CreateOrganizationInput,
} from "@/modules/organizations/schemas/create-organization-schema";
import { cn } from "@/lib/utils";

const ORG_TYPES = [
  {
    value: "PELADA" as const,
    label: "Pelada / Racha",
    description: "Encontros casuais sem resultado oficial. Só diversão.",
    icon: Swords,
    iconColor: "text-amber-500",
    iconBg: "bg-amber-50",
    selectedBorder: "border-amber-400",
    selectedBg: "bg-amber-50/60",
  },
  {
    value: "TEAM" as const,
    label: "Time Oficial",
    description: "Time estruturado com adversários, lineup e resultados.",
    icon: Shield,
    iconColor: "text-primary",
    iconBg: "bg-green-50",
    selectedBorder: "border-primary",
    selectedBg: "bg-green-50/60",
  },
] as const;

const BRAZIL_STATES = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS",
  "MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

export function CreateOrganizationForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedType, setSelectedType] = useState<"PELADA" | "TEAM" | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateOrganizationInput>({
    resolver: zodResolver(createOrganizationSchema),
  });

  const selectedModality = watch("modality");

  async function onSubmit(data: CreateOrganizationInput) {
    try {
      await createOrganizationAction(data);
    } catch (error) {
      if (error && typeof error === "object" && "digest" in error) throw error;
      toast.error(
        error instanceof Error ? error.message : "Erro ao criar organização",
      );
    }
  }

  function handleTypeSelect(type: "PELADA" | "TEAM") {
    setSelectedType(type);
    setValue("type", type);
    setTimeout(() => setStep(2), 180);
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-8 flex items-center gap-2">
        {([1, 2] as const).map((s) => (
          <div
            key={s}
            className={cn(
              "h-1.5 flex-1 rounded-full transition-all duration-500",
              s <= step ? "bg-primary" : "bg-slate-200",
            )}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
            >
              <h1 className="text-2xl font-black text-slate-900">
                Que tipo de organização?
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Escolha conforme o estilo do seu grupo.
              </p>

              <div className="mt-6 flex flex-col gap-4">
                {ORG_TYPES.map(
                  ({
                    value,
                    label,
                    description,
                    icon: Icon,
                    iconColor,
                    iconBg,
                    selectedBorder,
                    selectedBg,
                  }) => {
                    const isSelected = selectedType === value;
                    return (
                      <motion.button
                        key={value}
                        type="button"
                        onClick={() => handleTypeSelect(value)}
                        whileTap={{ scale: 0.97 }}
                        className={cn(
                          "flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all duration-200",
                          isSelected
                            ? `${selectedBorder} ${selectedBg} shadow-sm`
                            : "border-slate-200 bg-white hover:border-slate-300",
                        )}
                      >
                        <div
                          className={cn(
                            "grid size-12 shrink-0 place-items-center rounded-xl",
                            iconBg,
                          )}
                        >
                          <Icon className={cn("size-6", iconColor)} />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-slate-900">{label}</p>
                          <p className="mt-0.5 text-sm text-slate-500">
                            {description}
                          </p>
                        </div>
                        <ChevronRight
                          className={cn(
                            "size-5 shrink-0 text-slate-300 transition-colors",
                            isSelected && "text-primary",
                          )}
                        />
                      </motion.button>
                    );
                  },
                )}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="space-y-5"
            >
              <div>
                <h1 className="text-2xl font-black text-slate-900">
                  Detalhes da organização
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  Você pode alterar isso depois.
                </p>
              </div>

              <FormField
                label="Nome"
                htmlFor="name"
                error={errors.name?.message}
              >
                <Input
                  id="name"
                  placeholder={
                    selectedType === "PELADA"
                      ? "Ex: Pelada da Resenha"
                      : "Ex: Furacão FC"
                  }
                  hasError={!!errors.name}
                  {...register("name")}
                />
              </FormField>

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Modalidade{" "}
                  <span className="normal-case tracking-normal font-normal text-slate-300">
                    (opcional)
                  </span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_MODALITIES.map(({ value, label }) => {
                    const isActive = selectedModality === value;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() =>
                          setValue("modality", isActive ? undefined : value)
                        }
                        className={cn(
                          "rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition",
                          isActive
                            ? "border-primary bg-primary text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                        )}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  label="Cidade"
                  htmlFor="city"
                  error={errors.city?.message}
                >
                  <Input
                    id="city"
                    placeholder="São Paulo"
                    hasError={!!errors.city}
                    {...register("city")}
                  />
                </FormField>
                <FormField
                  label="Estado"
                  htmlFor="state"
                  error={errors.state?.message}
                >
                  <select
                    id="state"
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-4 text-base font-medium text-slate-900 outline-none transition focus:border-[#16A34A]"
                    {...register("state")}
                  >
                    <option value="">—</option>
                    {BRAZIL_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-xl border-2 border-slate-200 px-6 py-4 text-sm font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  Voltar
                </button>
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                  {isSubmitting ? "Criando..." : "Criar organização"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
