import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, MapPin, Users } from "lucide-react";

import { PageTransition } from "@/components/motion/page-transition";
import { PageHeader } from "@/components/navigation/page-header";
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
  OPEN: "bg-amber-100 text-amber-700",
  MATCHED: "bg-emerald-100 text-emerald-700",
  EXPIRED: "bg-slate-100 text-slate-500",
  CANCELLED: "bg-rose-100 text-rose-700",
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

  return (
    <PageTransition className="space-y-6">
      <PageHeader
        eyebrow="Mural de Jogos"
        title="Meus Jogos Publicados"
        description="Anúncios criados pelo seu time e o andamento dos pedidos de aceite."
      />

      <section className="space-y-3">
        <h2 className="text-lg font-black text-slate-900">Pendentes de aceite</h2>
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
          <h2 className="text-lg font-black text-slate-900">Encerrados</h2>
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
          <p className="font-bold text-slate-900">
            {listing.location} — {listing.city}/{listing.state}
          </p>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_CLASS[listing.status]}`}>
            {STATUS_LABEL[listing.status]}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <CalendarDays className="size-4" />
          <span className="capitalize">{formatListingDateTime(listing.scheduledAt)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-600">
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
