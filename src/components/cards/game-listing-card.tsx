import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";

import { CardHover } from "@/components/motion/card-hover";
import { Card } from "@/components/ui/card";
import { ALL_MODALITIES } from "@/constants/positions";
import { formatListingDateTime, formatPriceCents } from "@/modules/game-listings/lib/format";
import type { GameListingSummary } from "@/modules/game-listings/types";

export function GameListingCard({ listing }: { listing: GameListingSummary }) {
  const cover = listing.photos[0]?.url;
  const modalityLabel = ALL_MODALITIES.find((m) => m.value === listing.modality)?.label;

  return (
    <CardHover>
      <Link href={`/jogos/${listing.id}`}>
        <Card className="overflow-hidden">
          <div className="relative h-36 w-full bg-gradient-to-br from-green-100 to-emerald-50 dark:from-emerald-500/10 dark:to-primary/10">
            {cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={cover} alt={listing.location} className="h-full w-full object-cover" />
            ) : (
              <div className="grid h-full w-full place-items-center text-emerald-400 dark:text-emerald-600">
                <MapPin className="size-8" />
              </div>
            )}
            <span className="absolute right-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white backdrop-blur">
              {formatPriceCents(listing.priceCents)}
            </span>
          </div>

          <div className="space-y-2 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-primary">
              {listing.organization.name}
            </p>
            <h3 className="text-base font-black text-foreground">
              {listing.location} — {listing.city}/{listing.state}
            </h3>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CalendarDays className="size-4" />
              <span className="capitalize">{formatListingDateTime(listing.scheduledAt)}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              {modalityLabel && (
                <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                  {modalityLabel}
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                <Users className="size-3.5" />
                {listing._count.responses} interessados
              </span>
            </div>
          </div>
        </Card>
      </Link>
    </CardHover>
  );
}
