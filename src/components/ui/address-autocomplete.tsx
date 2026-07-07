"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, MapPin } from "lucide-react";

import { cn } from "@/lib/cn";
import { Input } from "./input";

export interface AddressSelection {
  address: string;
  lat: number;
  lng: number;
  city: string | null;
  state: string | null;
}

interface Prediction {
  placeId: string;
  description: string;
}

interface AddressAutocompleteProps {
  id?: string;
  placeholder?: string;
  initialValue?: string;
  onSelect: (selection: AddressSelection) => void;
  disabled?: boolean;
}

export function AddressAutocomplete({
  id,
  placeholder = "Digite o endereço...",
  initialValue = "",
  onSelect,
  disabled,
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState(initialValue);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isResolving, setIsResolving] = useState(false);
  const [resolved, setResolved] = useState<AddressSelection | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const skipNextSearch = useRef(false);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (skipNextSearch.current) {
      skipNextSearch.current = false;
      return;
    }

    if (query.trim().length < 3) {
      setPredictions([]);
      return;
    }

    setIsSearching(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/places/autocomplete?input=${encodeURIComponent(query)}`);
        const data = await res.json();
        setPredictions(data.predictions ?? []);
        setIsOpen(true);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  async function handleSelect(prediction: Prediction) {
    skipNextSearch.current = true;
    setQuery(prediction.description);
    setIsOpen(false);
    setPredictions([]);
    setIsResolving(true);

    try {
      const res = await fetch(`/api/places/details?placeId=${encodeURIComponent(prediction.placeId)}`);
      const data = await res.json();
      const selection: AddressSelection = {
        address: data.address,
        lat: data.lat,
        lng: data.lng,
        city: data.city,
        state: data.state,
      };
      setResolved(selection);
      onSelect(selection);
    } finally {
      setIsResolving(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Input
          id={id}
          placeholder={placeholder}
          value={query}
          disabled={disabled}
          autoComplete="off"
          onChange={(e) => {
            setQuery(e.target.value);
            setResolved(null);
          }}
          onFocus={() => predictions.length > 0 && setIsOpen(true)}
          className="pr-11"
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          {isSearching || isResolving ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <MapPin className="h-5 w-5" />
          )}
        </span>
      </div>

      {isOpen && predictions.length > 0 && (
        <ul className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-xl border-2 border-border bg-card shadow-lg">
          {predictions.map((p) => (
            <li key={p.placeId}>
              <button
                type="button"
                onClick={() => handleSelect(p)}
                className="flex w-full items-start gap-2 px-4 py-3 text-left text-sm font-medium text-foreground transition hover:bg-muted"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                {p.description}
              </button>
            </li>
          ))}
        </ul>
      )}

      {resolved?.city && resolved?.state && (
        <p className={cn("mt-1.5 text-xs font-medium text-muted-foreground")}>
          {resolved.city} - {resolved.state}
        </p>
      )}
    </div>
  );
}
