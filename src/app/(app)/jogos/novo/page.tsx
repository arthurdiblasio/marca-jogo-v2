import { PageTransition } from "@/components/motion/page-transition";
import { PageHeader } from "@/components/navigation/page-header";
import { CreateGameListingForm } from "@/components/game-listings/create-game-listing-form";

export default function NewGameListingPage() {
  return (
    <PageTransition className="space-y-4">
      <PageHeader
        eyebrow="Mural de Jogos"
        title="Publicar jogo"
        description="Anuncie um horário livre no seu campo para outros times encontrarem."
      />
      <CreateGameListingForm />
    </PageTransition>
  );
}
