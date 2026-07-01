import Link from "next/link";
import { ClipboardList, Plus } from "lucide-react";

import { PageTransition } from "@/components/motion/page-transition";
import { PageHeader } from "@/components/navigation/page-header";
import { Button } from "@/components/ui/button";
import { ComponentStateView } from "@/components/cards/component-state";
import { GameListingCard } from "@/components/cards/game-listing-card";
import { GameListingsFilterBar } from "@/components/game-listings/game-listings-filter-bar";
import { gameListingRepository } from "@/modules/game-listings/repositories/game-listing-repository";
import type { SportModality } from "@/generated/prisma/enums";

export default async function GameListingsBoardPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; state?: string; modality?: string }>;
}) {
  const params = await searchParams;

  const listings = await gameListingRepository.listOpen({
    city: params.city,
    state: params.state,
    modality: params.modality as SportModality | undefined,
  });

  return (
    <PageTransition className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <PageHeader
          eyebrow="Mural de Jogos"
          title="Times buscando adversário"
          description="Encontre times com campo já reservado ou publique o seu jogo para outros times encontrarem."
        />
        <div className="flex shrink-0 gap-2">
          <Button asChild variant="outline" size="sm" className="w-auto">
            <Link href="/jogos/meus-jogos">
              <ClipboardList className="size-4" />
              Meus jogos
            </Link>
          </Button>
          <Button asChild size="sm" className="w-auto">
            <Link href="/jogos/novo">
              <Plus className="size-4" />
              Publicar jogo
            </Link>
          </Button>
        </div>
      </div>

      <GameListingsFilterBar />

      {listings.length === 0 ? (
        <ComponentStateView state="empty" emptyLabel="Nenhum jogo disponível com esses filtros" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {listings.map((listing) => (
            <GameListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </PageTransition>
  );
}
