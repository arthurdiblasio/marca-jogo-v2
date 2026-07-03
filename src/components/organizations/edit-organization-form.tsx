"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";
import { AddressAutocomplete, type AddressSelection } from "@/components/ui/address-autocomplete";
import { ImageUpload } from "@/components/ui/image-upload";
import { ALL_MODALITIES } from "@/constants/positions";
import { WEEKDAYS } from "@/constants/weekdays";
import { updateOrganizationAction } from "@/modules/organizations/actions/update-organization";
import { cn } from "@/lib/utils";
import type { SportModality } from "@/generated/prisma/enums";

interface EditOrganizationFormProps {
  organization: {
    id: string;
    name: string;
    type: "PELADA" | "TEAM";
    logoUrl: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    lat: number | null;
    lng: number | null;
    modality: SportModality | null;
    description: string | null;
    weekday: number | null;
    scheduledTime: string | null;
    monthlyFee: number | null;
    singleFee: number | null;
  };
}

export function EditOrganizationForm({ organization }: EditOrganizationFormProps) {
  const router = useRouter();
  const [name, setName] = useState(organization.name);
  const [logoUrl, setLogoUrl] = useState<string | null>(organization.logoUrl);
  const [modality, setModality] = useState<SportModality | null>(organization.modality);
  const [description, setDescription] = useState(organization.description ?? "");
  const [addressSelection, setAddressSelection] = useState<AddressSelection>({
    address: organization.address ?? "",
    city: organization.city,
    state: organization.state,
    lat: organization.lat ?? 0,
    lng: organization.lng ?? 0,
  });
  const [weekday, setWeekday] = useState<number | null>(organization.weekday);
  const [scheduledTime, setScheduledTime] = useState(organization.scheduledTime ?? "");
  const [monthlyFee, setMonthlyFee] = useState(
    organization.monthlyFee != null ? String(organization.monthlyFee) : "",
  );
  const [singleFee, setSingleFee] = useState(
    organization.singleFee != null ? String(organization.singleFee) : "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (name.trim().length < 3) {
      toast.error("Informe um nome com pelo menos 3 caracteres");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateOrganizationAction({
        organizationId: organization.id,
        name: name.trim(),
        modality: modality ?? undefined,
        logoUrl: logoUrl ?? undefined,
        address: addressSelection.address || undefined,
        city: addressSelection.city ?? undefined,
        state: addressSelection.state ?? undefined,
        lat: addressSelection.lat || undefined,
        lng: addressSelection.lng || undefined,
        description: description.trim() || undefined,
        weekday: organization.type === "PELADA" ? weekday ?? undefined : undefined,
        scheduledTime: organization.type === "PELADA" ? scheduledTime || undefined : undefined,
        monthlyFee:
          organization.type === "PELADA" && monthlyFee ? Number(monthlyFee) : undefined,
        singleFee: organization.type === "PELADA" && singleFee ? Number(singleFee) : undefined,
      });
      toast.success(organization.type === "TEAM" ? "Dados do time atualizados!" : "Dados da pelada atualizados!");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erro ao salvar dados do time");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="p-5">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col items-center gap-1.5">
          <ImageUpload
            folder="organizations/logos"
            shape="square"
            value={logoUrl}
            onChange={setLogoUrl}
          />
          <p className="text-xs text-slate-400">
            Escudo {organization.type === "TEAM" ? "do time" : "da pelada"} (opcional)
          </p>
        </div>

        <FormField label="Nome" htmlFor="name">
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </FormField>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400">
            Modalidade{" "}
            <span className="normal-case tracking-normal font-normal text-slate-300">(opcional)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {ALL_MODALITIES.map(({ value, label }) => {
              const isActive = modality === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setModality(isActive ? null : value)}
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

        <FormField
          label="Endereço"
          htmlFor="address"
          description={
            organization.type === "TEAM"
              ? "O campo/quadra onde o time manda seus jogos."
              : "O local onde a pelada costuma acontecer."
          }
        >
          <AddressAutocomplete
            id="address"
            placeholder="Digite o endereço do campo/quadra"
            initialValue={organization.address ?? ""}
            onSelect={setAddressSelection}
          />
        </FormField>

        {organization.type === "PELADA" && (
          <>
            <div>
              <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-slate-400">
                Recorrência
              </label>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full border-2 border-primary bg-primary px-4 py-1.5 text-sm font-semibold text-white">
                  Semanal
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Dia da semana" htmlFor="weekday">
                <select
                  id="weekday"
                  value={weekday ?? ""}
                  onChange={(e) => setWeekday(e.target.value === "" ? null : Number(e.target.value))}
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 outline-none transition focus:border-[#16A34A]"
                >
                  <option value="">Selecione</option>
                  {WEEKDAYS.map((day) => (
                    <option key={day.value} value={day.value}>
                      {day.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Horário" htmlFor="scheduledTime">
                <Input
                  id="scheduledTime"
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Valor mensalista" htmlFor="monthlyFee" description="R$ por mês">
                <Input
                  id="monthlyFee"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0,00"
                  value={monthlyFee}
                  onChange={(e) => setMonthlyFee(e.target.value)}
                />
              </FormField>

              <FormField label="Valor avulso" htmlFor="singleFee" description="R$ por jogo">
                <Input
                  id="singleFee"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0,00"
                  value={singleFee}
                  onChange={(e) => setSingleFee(e.target.value)}
                />
              </FormField>
            </div>
          </>
        )}

        <FormField label="Descrição" htmlFor="description" description="Opcional">
          <textarea
            id="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-base font-medium text-slate-900 outline-none transition placeholder:text-slate-300 focus:border-[#16A34A]"
            placeholder="Conte um pouco sobre o time"
          />
        </FormField>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar alterações"}
        </Button>
      </form>
    </Card>
  );
}
