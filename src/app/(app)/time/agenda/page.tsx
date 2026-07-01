import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, MapPin, Shield } from "lucide-react";

import { PageTransition } from "@/components/motion/page-transition";
import { PageHeader } from "@/components/navigation/page-header";
import { Card } from "@/components/ui/card";
import { requireAuth } from "@/shared/auth/require-auth";
import { getActiveOrgId } from "@/shared/orgs/active-org-cookie";
import { matchRepository } from "@/modules/matches/repositories/match-repository";
import { getMatchPerspective } from "@/modules/matches/lib/format";
import type { MatchWithOrgs } from "@/modules/matches/types";
import { formatListingDateTime } from "@/modules/game-listings/lib/format";

export default async function TeamAgendaPage() {
  await requireAuth();

  const activeOrgId = await getActiveOrgId();
  if (!activeOrgId) {
    redirect("/dashboard");
  }

  const [upcoming, past] = await Promise.all([
    matchRepository.listUpcomingByOrganization(activeOrgId),
    matchRepository.listPastByOrganization(activeOrgId),
  ]);

  return (
    <PageTransition className="space-y-6">
      <PageHeader eyebrow="Time" title="Agenda" description="Jogos futuros e resultados anteriores do seu time." />

      <section className="space-y-3">
        <h2 className="text-lg font-black text-slate-900">Próximos jogos</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-slate-400">
            Nenhum jogo agendado.{" "}
            <Link href="/jogos" className="font-semibold text-primary">
              Buscar adversário no mural
            </Link>
          </p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((match) => (
              <UpcomingMatchCard key={match.id} match={match} activeOrgId={activeOrgId} />
            ))}
          </div>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-black text-slate-900">Jogos anteriores</h2>
        {past.length === 0 ? (
          <p className="text-sm text-slate-400">Nenhum jogo anterior ainda.</p>
        ) : (
          <div className="space-y-3">
            {past.map((match) => (
              <PastMatchCard key={match.id} match={match} activeOrgId={activeOrgId} />
            ))}
          </div>
        )}
      </section>

      <Link href="/time" className="inline-block text-sm font-semibold text-primary">
        ← Voltar para o time
      </Link>
    </PageTransition>
  );
}

const OUTCOME_LABEL: Record<string, string> = { V: "Vitória", E: "Empate", D: "Derrota" };
const OUTCOME_CLASS: Record<string, string> = {
  V: "bg-emerald-100 text-emerald-700",
  E: "bg-amber-100 text-amber-700",
  D: "bg-rose-100 text-rose-700",
};

function UpcomingMatchCard({ match, activeOrgId }: { match: MatchWithOrgs; activeOrgId: string }) {
  const { isHome, opponentLabel } = getMatchPerspective(match, activeOrgId);

  return (
    <Card className="space-y-2 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Shield className="size-4 text-primary" />
          <p className="font-bold text-slate-900">vs {opponentLabel}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          {isHome ? "Casa" : "Fora"}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <CalendarDays className="size-4" />
        <span className="capitalize">{formatListingDateTime(match.scheduledAt)}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <MapPin className="size-4" />
        <span>{match.location}</span>
      </div>
    </Card>
  );
}

function PastMatchCard({ match, activeOrgId }: { match: MatchWithOrgs; activeOrgId: string }) {
  const { opponentLabel, teamScore, opponentScore, outcome } = getMatchPerspective(match, activeOrgId);

  return (
    <Card className="flex items-center justify-between gap-3 p-4">
      <div>
        <p className="font-bold text-slate-900">vs {opponentLabel}</p>
        <p className="text-sm text-slate-500 capitalize">{formatListingDateTime(match.scheduledAt)}</p>
      </div>
      <div className="flex items-center gap-2">
        {match.status === "CANCELLED" ? (
          <span className="text-sm font-semibold text-slate-400">Cancelado</span>
        ) : (
          <>
            {teamScore != null && opponentScore != null && (
              <span className="rounded bg-slate-100 px-3 py-1 text-sm font-black text-slate-700">
                {teamScore} x {opponentScore}
              </span>
            )}
            {outcome && (
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${OUTCOME_CLASS[outcome]}`}>
                {OUTCOME_LABEL[outcome]}
              </span>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
