import { PageTransition } from "@/components/motion/page-transition";
import { PageHeader } from "@/components/navigation/page-header";
import { CreateGameListingForm } from "@/components/game-listings/create-game-listing-form";
import { getActiveOrgId } from "@/shared/orgs/active-org-cookie";
import { organizationRepository } from "@/modules/organizations/repositories/organization-repository";

export default async function NewGameListingPage() {
  const organizationId = await getActiveOrgId();
  const organization = organizationId ? await organizationRepository.findById(organizationId) : null;

  const homeAddress =
    organization?.address && organization.city && organization.state
      ? {
          address: organization.address,
          city: organization.city,
          state: organization.state,
          lat: organization.lat ? Number(organization.lat) : null,
          lng: organization.lng ? Number(organization.lng) : null,
        }
      : null;

  return (
    <PageTransition className="space-y-4">
      <PageHeader
        eyebrow="Mural de Jogos"
        title="Publicar jogo"
        description="Anuncie um horário livre no seu campo para outros times encontrarem."
      />
      <CreateGameListingForm homeAddress={homeAddress} />
    </PageTransition>
  );
}
