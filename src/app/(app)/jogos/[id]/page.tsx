import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin } from "lucide-react";

import { PageTransition } from "@/components/motion/page-transition";
import { PageHeader } from "@/components/navigation/page-header";
import { Card } from "@/components/ui/card";
import { ALL_MODALITIES } from "@/constants/positions";
import { requireAuth } from "@/shared/auth/require-auth";
import { getActiveOrgId } from "@/shared/orgs/active-org-cookie";
import { gameListingRepository } from "@/modules/game-listings/repositories/game-listing-repository";
import { formatListingDateTime, formatPriceCents } from "@/modules/game-listings/lib/format";
import { GameListingResponsesList } from "@/components/game-listings/game-listing-responses-list";
import { ExpressInterestButton } from "@/components/game-listings/express-interest-button";
import { CancelListingButtons } from "@/components/game-listings/cancel-listing-buttons";

export default async function GameListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  await requireAuth();
  const activeOrgId = await getActiveOrgId();

  const listing = await gameListingRepository.findById(id);
  if (!listing) {
    notFound();
  }

  const isOwner = activeOrgId === listing.organizationId;
  const alreadyResponded = listing.responses.some((r) => r.organizationId === activeOrgId);
  const modalityLabel = ALL_MODALITIES.find((m) => m.value === listing.modality)?.label;

  return (
    <PageTransition className="space-y-4">
      <PageHeader
        eyebrow={listing.organization.name}
        title={`${listing.location} — ${listing.city}/${listing.state}`}
        description={modalityLabel}
      />

      {listing.photos.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {listing.photos.map((photo) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={photo.id}
              src={photo.url}
              alt={listing.location}
              className="h-40 w-full rounded-xl object-cover"
            />
          ))}
        </div>
      )}

      <Card className="space-y-3 p-5">
        <div className="flex items-center gap-2 text-slate-700">
          <CalendarDays className="size-4" />
          <span className="capitalize font-semibold">{formatListingDateTime(listing.scheduledAt)}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <MapPin className="size-4" />
          <span className="font-semibold">
            {listing.location}, {listing.city}/{listing.state}
          </span>
        </div>
        <p className="text-lg font-black text-primary">
          {formatPriceCents(listing.priceCents)}
          {listing.priceNotes && <span className="ml-2 text-sm font-medium text-slate-500">{listing.priceNotes}</span>}
        </p>
        {listing.notes && <p className="text-sm text-slate-600">{listing.notes}</p>}

        {listing.status === "MATCHED" && (
          <p className="text-sm font-semibold text-emerald-600">
            Jogo fechado com {listing.responses.find((r) => r.status === "ACCEPTED")?.organization.name ?? "outro time"}!
          </p>
        )}
        {listing.status === "CANCELLED" && <p className="text-sm font-semibold text-slate-400">Este jogo foi cancelado.</p>}

        {!isOwner && listing.status === "OPEN" && (
          <ExpressInterestButton
            gameListingId={listing.id}
            disabled={alreadyResponded}
            disabledLabel={alreadyResponded ? "Interesse já enviado" : undefined}
          />
        )}

        {isOwner && listing.status === "OPEN" && (
          <CancelListingButtons gameListingId={listing.id} seriesId={listing.seriesId} />
        )}
      </Card>

      {isOwner && (
        <div className="space-y-3">
          <h2 className="text-lg font-black text-slate-900">Times interessados</h2>
          <GameListingResponsesList
            gameListingId={listing.id}
            responses={listing.responses}
            canAccept={listing.status === "OPEN"}
          />
        </div>
      )}

      <Link href="/jogos" className="inline-block text-sm font-semibold text-primary">
        ← Voltar para o mural
      </Link>
    </PageTransition>
  );
}
