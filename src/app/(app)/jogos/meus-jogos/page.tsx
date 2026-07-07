import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CalendarDays, MapPin, Users } from "lucide-react";

import { PageTransition } from "@/components/motion/page-transition";
import { PageHeader } from "@/components/navigation/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ComponentStateView } from "@/components/cards/component-state";
import { requireAuth } from "@/shared/auth/require-auth";
import { getActiveOrgId } from "@/shared/orgs/active-org-cookie";
import { gameListingRepository } from "@/modules/game-listings/repositories/game-listing-repository";
import { formatListingDateTime } from "@/modules/game-listings/lib/format";
import type { MyGameListing } from "@/modules/game-listings/types";

const STATUS_LABEL: Record<string, string> = {
  OPEN: "Aberto",
  MATCHED: "Fechado",
  EXPIRED: "Expirado",
  CANCELLED: "Cancelado",
};

const STATUS_CLASS: Record<string, string> = {
  OPEN: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  MATCHED: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  EXPIRED: "bg-muted text-muted-foreground",
  CANCELLED: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
};

export default async function MyGameListingsPage() {
  await requireAuth();

  const activeOrgId = await getActiveOrgId();
  if (!activeOrgId) {
    redirect("/dashboard");
  }

  const listings = await gameListingRepository.listByOrganization(activeOrgId);

  const pending = listings.filter((listing) => listing.status === "OPEN");
  const closed = listings.filter((listing) => listing.status !== "OPEN");
  const totalPendingResponses = pending.reduce((sum, listing) => sum + listing.responses.length, 0);

  return (
    <PageTransition className="space-y-6">
      <PageHeader
        eyebrow="Mural de Jogos"
        title="Meus Jogos Publicados"
        description="Anúncios criados pelo seu time e o andamento dos pedidos de aceite."
      />

      {totalPendingResponses > 0 && (
        <Card className="flex items-center justify-between gap-3 border-2 border-primary/20 bg-primary/10 p-4">
          <div className="flex items-center gap-2 font-bold text-foreground">
            <Users className="size-5 text-primary" />
            {totalPendingResponses} {totalPendingResponses > 1 ? "interesses aguardando" : "interesse aguardando"}{" "}
            aceite
          </div>
          <Button asChild size="sm" className="w-auto">
            <Link href="/jogos/interesses">
              Ver e aceitar
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </Card>
      )}

      <section className="space-y-3">
        <h2 className="text-lg font-black text-foreground">Pendentes de aceite</h2>
        {pending.length === 0 ? (
          <ComponentStateView state="empty" emptyLabel="Nenhum jogo aguardando aceite no momento" />
        ) : (
          <div className="space-y-3">
            {pending.map((listing) => (
              <MyGameListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      {closed.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-black text-foreground">Encerrados</h2>
          <div className="space-y-3">
            {closed.map((listing) => (
              <MyGameListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      )}

      <Link href="/jogos" className="inline-block text-sm font-semibold text-primary">
        ← Voltar para o mural
      </Link>
    </PageTransition>
  );
}

function MyGameListingCard({ listing }: { listing: MyGameListing }) {
  const pendingCount = listing.responses.length;

  return (
    <Link href={`/jogos/${listing.id}`}>
      <Card className="space-y-2 p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="font-bold text-foreground">
            {listing.location} — {listing.city}/{listing.state}
          </p>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_CLASS[listing.status]}`}>
            {STATUS_LABEL[listing.status]}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays className="size-4" />
          <span className="capitalize">{formatListingDateTime(listing.scheduledAt)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="size-4" />
          <span>{listing.location}</span>
        </div>
        {listing.status === "OPEN" && (
          <div className="flex items-center gap-1.5 pt-1 text-sm font-semibold text-primary">
            <Users className="size-4" />
            {pendingCount === 0
              ? "Nenhum interessado ainda"
              : `${pendingCount} pedido${pendingCount > 1 ? "s" : ""} de aceite aguardando`}
          </div>
        )}
      </Card>
    </Link>
  );
}
