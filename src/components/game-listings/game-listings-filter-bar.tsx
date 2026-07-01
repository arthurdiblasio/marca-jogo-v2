"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Loader2 } from "lucide-react";

import { ALL_MODALITIES } from "@/constants/positions";
import { fetchCitiesByState, fetchStates } from "@/constants/brazil-locations";
import { cn } from "@/lib/utils";
import type { SportModality } from "@/generated/prisma/enums";

export function GameListingsFilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentState = searchParams.get("state") ?? "";
  const currentCity = searchParams.get("city") ?? "";
  const currentModality = (searchParams.get("modality") as SportModality | null) ?? "";

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
    if (!currentState) {
      setCities([]);
      return;
    }
    setLoadingCities(true);
    fetchCitiesByState(currentState)
      .then(setCities)
      .finally(() => setLoadingCities(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentState]);

  function updateParams(next: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    router.push(`/jogos?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative">
        <select
          value={currentState}
          disabled={loadingStates}
          onChange={(e) => updateParams({ state: e.target.value || undefined, city: undefined })}
          className="w-44 appearance-none rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-[#16A34A] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">{loadingStates ? "Carregando..." : "Todos os estados"}</option>
          {states.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label} ({s.value})
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          {loadingStates ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronDown className="h-4 w-4" />}
        </span>
      </div>

      <div className="relative">
        <select
          value={currentCity}
          disabled={!currentState || loadingCities}
          onChange={(e) => updateParams({ city: e.target.value || undefined })}
          className="w-44 appearance-none rounded-xl border-2 border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 outline-none transition focus:border-[#16A34A] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">
            {loadingCities ? "Carregando..." : currentState ? "Todas as cidades" : "Selecione o estado"}
          </option>
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
          {loadingCities ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronDown className="h-4 w-4" />}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {ALL_MODALITIES.map(({ value, label }) => {
          const isActive = currentModality === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => updateParams({ modality: isActive ? undefined : value })}
              className={cn(
                "rounded-full border-2 px-3 py-1.5 text-xs font-semibold transition",
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
  );
}
