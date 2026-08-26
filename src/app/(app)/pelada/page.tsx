import { redirect } from "next/navigation";
import { MapPin, Shield } from "lucide-react";

import { PageTransition } from "@/components/motion/page-transition";
import { PageHeader } from "@/components/navigation/page-header";
import { Card } from "@/components/ui/card";
import { PeladaProfileTabs } from "@/components/team/pelada-profile-tabs";
import { EditOrganizationForm } from "@/components/organizations/edit-organization-form";
import { requireAuth } from "@/shared/auth/require-auth";
import { getActiveOrgId } from "@/shared/orgs/active-org-cookie";
import { requireOrgMembership } from "@/shared/orgs/require-org-membership";
import { organizationRepository } from "@/modules/organizations/repositories/organization-repository";
import { WEEKDAYS } from "@/constants/weekdays";

const MANAGER_ROLES = ["OWNER", "ADMIN", "CAPTAIN"];

const MODALITY_LABEL: Record<string, string> = {
  FIELD_11: "Campo 11",
  SOCIETY_7: "Society 7",
  SOCIETY_6: "Society 6",
  FUTSAL_5: "Futsal 5",
};

function formatCurrency(value: number | null | undefined) {
  if (value == null) return null;
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default async function PeladaProfilePage() {
  const session = await requireAuth();

  const activeOrgId = await getActiveOrgId();
  if (!activeOrgId) {
    redirect("/dashboard");
  }

  const [organization, membership] = await Promise.all([
    organizationRepository.findById(activeOrgId),
    requireOrgMembership(session.id, activeOrgId),
  ]);

  if (!organization) {
    redirect("/dashboard");
  }

  const canEdit = MANAGER_ROLES.includes(membership.role);
  const weekdayLabel = WEEKDAYS.find((day) => day.value === organization.weekday)?.label;

  return (
    <PageTransition className="space-y-4">
      <PageHeader
        eyebrow="Pelada"
        title={organization.name}
        description="Dados cadastrais da pelada e gestão dos jogadores."
      />

      <PeladaProfileTabs />

      {canEdit ? (
        <EditOrganizationForm
          organization={{
            id: organization.id,
            name: organization.name,
            type: organization.type,
            logoUrl: organization.logoUrl,
            address: organization.address,
            city: organization.city,
            state: organization.state,
            lat: organization.lat ? Number(organization.lat) : null,
            lng: organization.lng ? Number(organization.lng) : null,
            modality: organization.modality,
            description: organization.description,
            weekday: organization.weekday,
            scheduledTime: organization.scheduledTime,
            monthlyFee: organization.monthlyFee ? Number(organization.monthlyFee) : null,
            singleFee: organization.singleFee ? Number(organization.singleFee) : null,
          }}
        />
      ) : (
        <Card className="flex items-start gap-4 p-5">
          <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-2xl bg-primary/10">
            {organization.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={organization.logoUrl} alt={organization.name} className="size-full object-cover" />
            ) : (
              <Shield className="size-7 text-primary" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-black text-foreground">{organization.name}</p>
            {organization.modality && (
              <p className="text-sm text-muted-foreground">{MODALITY_LABEL[organization.modality]}</p>
            )}
            {organization.address && (
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="size-4 shrink-0" />
                {organization.address}
              </p>
            )}
            {weekdayLabel && organization.scheduledTime && (
              <p className="mt-2 text-sm text-muted-foreground">
                Toda {weekdayLabel}, às {organization.scheduledTime}
              </p>
            )}
            {(organization.monthlyFee || organization.singleFee) && (
              <p className="mt-1 text-sm text-muted-foreground">
                Mensalista: {formatCurrency(Number(organization.monthlyFee)) ?? "não definido"} · Avulso:{" "}
                {formatCurrency(Number(organization.singleFee)) ?? "não definido"}
              </p>
            )}
            {organization.description && (
              <p className="mt-2 text-sm text-muted-foreground">{organization.description}</p>
            )}
          </div>
        </Card>
      )}
    </PageTransition>
  );
}
