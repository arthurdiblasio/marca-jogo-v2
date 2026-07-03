"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { createPeladaOccurrenceAction } from "@/modules/pelada-occurrences/actions/create-pelada-occurrence";

function toDatetimeLocalValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function CreateRodadaForm({
  organizationId,
  defaultLocation,
  defaultDate,
}: {
  organizationId: string;
  defaultLocation: string;
  defaultDate: Date | null;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("Pelada");
  const [scheduledAt, setScheduledAt] = useState(toDatetimeLocalValue(defaultDate ?? new Date()));
  const [location, setLocation] = useState(defaultLocation);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) {
    return (
      <Button size="sm" className="w-auto" onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        Registrar rodada
      </Button>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createPeladaOccurrenceAction({ organizationId, title, scheduledAt, location });
      toast.success("Rodada registrada!");
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao registrar rodada");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <p className="font-bold text-slate-900">Nova rodada</p>
        <button type="button" onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
          <X className="size-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField label="Título" htmlFor="title">
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required minLength={3} />
        </FormField>

        <FormField label="Data e horário" htmlFor="scheduledAt">
          <Input
            id="scheduledAt"
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            required
          />
        </FormField>

        <FormField label="Local" htmlFor="location">
          <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} required minLength={3} />
        </FormField>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Salvando..." : "Registrar rodada"}
        </Button>
      </form>
    </Card>
  );
}
