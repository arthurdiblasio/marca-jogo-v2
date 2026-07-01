"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { ALL_MODALITIES } from "@/constants/positions";
import { fetchCitiesByState, fetchStates } from "@/constants/brazil-locations";
import { createGameListingAction } from "@/modules/game-listings/actions/create-game-listing";
import { computeSeriesEndDate } from "@/modules/game-listings/lib/recurrence";
import { cn } from "@/lib/utils";
import type { GameListingFrequency, SportModality } from "@/generated/prisma/enums";

const FREQUENCIES: { value: GameListingFrequency; label: string }[] = [
  { value: "DAILY", label: "Diário" },
  { value: "WEEKLY", label: "Semanal" },
  { value: "BIWEEKLY", label: "A cada 15 dias" },
  { value: "MONTHLY", label: "Mensal" },
];

export function CreateGameListingForm() {
  const [modality, setModality] = useState<SportModality | null>(null);
  const [scheduledAt, setScheduledAt] = useState("");
  const [location, setLocation] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [priceReais, setPriceReais] = useState("");
  const [priceNotes, setPriceNotes] = useState("");
  const [notes, setNotes] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState<GameListingFrequency | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [states, setStates] = useState<{ value: string; label: string }[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingCities, setLoadingCities] = useState(false);

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

  function handlePhotosChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    setPhotos((prev) => [...prev, ...files]);
    e.target.value = "";
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!modality) {
      toast.error("Selecione a modalidade");
      return;
    }
    if (!scheduledAt) {
      toast.error("Selecione a data e hora do jogo");
      return;
    }
    if (!state || !city) {
      toast.error("Selecione o estado e a cidade");
      return;
    }
    if (isRecurring && !frequency) {
      toast.error("Selecione a frequência da recorrência");
      return;
    }

    const formData = new FormData();
    formData.set("modality", modality);
    formData.set("scheduledAt", scheduledAt);
    formData.set("location", location);
    formData.set("city", city);
    formData.set("state", state);
    if (priceReais) {
      formData.set("priceCents", String(Math.round(Number(priceReais.replace(",", ".")) * 100)));
    }
    if (priceNotes) formData.set("priceNotes", priceNotes);
    if (notes) formData.set("notes", notes);
    formData.set("isRecurring", String(isRecurring));
    if (isRecurring && frequency) formData.set("frequency", frequency);
    photos.forEach((file) => formData.append("photos", file));

    setIsSubmitting(true);
    try {
      await createGameListingAction(formData);
    } catch (error) {
      if (error && typeof error === "object" && "digest" in error) throw error;
      toast.error(error instanceof Error ? error.message : "Erro ao publicar jogo");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-full max-w-lg space-y-5">
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400">
          Modalidade
        </label>
        <div className="flex flex-wrap gap-2">
          {ALL_MODALITIES.map(({ value, label }) => {
            const isActive = modality === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setModality(value)}
                className={cn(
                  "rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition",
                  isActive
                    ? "border-primary bg-primary text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <FormField label="Local (campo/quadra)" htmlFor="location">
        <Input
          id="location"
          placeholder="Ex: Campo do Aliança"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </FormField>

      <div className="flex flex-col gap-3 sm:flex-row">
        <FormField label="Estado" htmlFor="state">
          <div className="relative">
            <select
              id="state"
              disabled={loadingStates}
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full appearance-none rounded-xl border-2 border-slate-200 bg-white px-4 py-4 text-base font-medium text-slate-900 outline-none transition focus:border-[#16A34A] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">{loadingStates ? "Carregando..." : "Selecione"}</option>
              {states.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label} ({s.value})
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              {loadingStates ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronDown className="h-4 w-4" />}
            </span>
          </div>
        </FormField>

        <FormField label="Cidade" htmlFor="city">
          <div className="relative">
            <select
              id="city"
              disabled={!state || loadingCities}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full appearance-none rounded-xl border-2 border-slate-200 bg-white px-4 py-4 text-base font-medium text-slate-900 outline-none transition focus:border-[#16A34A] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">{loadingCities ? "Carregando..." : state ? "Selecione" : "Escolha o estado"}</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              {loadingCities ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronDown className="h-4 w-4" />}
            </span>
          </div>
        </FormField>
      </div>

      <FormField label="Data e horário" htmlFor="scheduledAt">
        <Input
          id="scheduledAt"
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
        />
      </FormField>

      <div className="flex flex-col gap-3 sm:flex-row">
        <FormField label="Valor (R$)" htmlFor="priceReais" description="Deixe em branco se for gratuito">
          <Input
            id="priceReais"
            inputMode="decimal"
            placeholder="Ex: 165,00"
            value={priceReais}
            onChange={(e) => setPriceReais(e.target.value)}
          />
        </FormField>

        <FormField label="Observações do valor" htmlFor="priceNotes" description="Ex: juiz incluso">
          <Input
            id="priceNotes"
            placeholder="Ex: Taxa com juiz incluso"
            value={priceNotes}
            onChange={(e) => setPriceNotes(e.target.value)}
          />
        </FormField>
      </div>

      <FormField label="Observações" htmlFor="notes" description="Opcional">
        <textarea
          id="notes"
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-[#16A34A]"
          placeholder="Detalhes extras sobre o jogo, nível do time, etc."
        />
      </FormField>

      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400">
          Fotos do local
        </label>
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-6 text-sm font-semibold text-slate-500 transition hover:border-slate-400">
          <ImagePlus className="size-5" />
          Adicionar fotos
          <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotosChange} />
        </label>
        {photos.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {photos.map((file, i) => (
              <div key={i} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="size-20 rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-slate-900 text-white"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border-2 border-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-slate-900">Jogo recorrente</p>
            <p className="text-sm text-slate-500">Repita este anúncio automaticamente pelos próximos 12 meses.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsRecurring((v) => !v)}
            className={cn(
              "relative h-7 w-12 shrink-0 rounded-full transition",
              isRecurring ? "bg-primary" : "bg-slate-200"
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 size-6 rounded-full bg-white shadow transition-all",
                isRecurring ? "left-[22px]" : "left-0.5"
              )}
            />
          </button>
        </div>

        {isRecurring && (
          <div className="mt-4 space-y-2">
            <div className="flex flex-wrap gap-2">
              {FREQUENCIES.map(({ value, label }) => {
                const isActive = frequency === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setFrequency(value)}
                    className={cn(
                      "rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition",
                      isActive
                        ? "border-primary bg-primary text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            {scheduledAt && (
              <p className="text-xs text-slate-400">
                Serão criados jogos até{" "}
                {computeSeriesEndDate(new Date(scheduledAt)).toLocaleDateString("pt-BR")}.
              </p>
            )}
          </div>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Publicando..." : "Publicar jogo"}
      </Button>
    </form>
  );
}
