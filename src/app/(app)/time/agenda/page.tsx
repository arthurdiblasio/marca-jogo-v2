import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, CalendarDays, ChevronLeft, ChevronRight, MapPin, Shield } from "lucide-react";

import { PageTransition } from "@/components/motion/page-transition";
import { PageHeader } from "@/components/navigation/page-header";
import { PageSizeSelect } from "@/components/pagination/page-size-select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { requireAuth } from "@/shared/auth/require-auth";
import { getActiveOrgId } from "@/shared/orgs/active-org-cookie";
import { matchRepository } from "@/modules/matches/repositories/match-repository";
import { getMatchPerspective } from "@/modules/matches/lib/format";
import type { MatchWithOrgs } from "@/modules/matches/types";
import { formatListingDateTime } from "@/modules/game-listings/lib/format";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
const DEFAULT_PAGE_SIZE = 10;

function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push("ellipsis");
    }
    result.push(sorted[i]);
  }
  return result;
}

export default async function TeamAgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; pageSize?: string }>;
}) {
  await requireAuth();

  const activeOrgId = await getActiveOrgId();
  if (!activeOrgId) {
    redirect("/dashboard");
  }

  const { page: pageParam, pageSize: pageSizeParam } = await searchParams;
  const pageSize = PAGE_SIZE_OPTIONS.includes(Number(pageSizeParam)) ? Number(pageSizeParam) : DEFAULT_PAGE_SIZE;
  const page = Math.max(1, Number(pageParam) || 1);

  const [upcoming, past, pastTotal] = await Promise.all([
    matchRepository.listUpcomingByOrganization(activeOrgId),
    matchRepository.listPastByOrganization(activeOrgId, pageSize, (page - 1) * pageSize),
    matchRepository.countPastByOrganization(activeOrgId),
  ]);

  const totalPages = Math.max(1, Math.ceil(pastTotal / pageSize));
  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <PageTransition className="space-y-6">
      <PageHeader eyebrow="Time" title="Agenda" description="Jogos futuros e resultados anteriores do seu time." />

      <section className="space-y-3">
        <h2 className="text-lg font-black text-foreground">Próximos jogos</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-muted-foreground">
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
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-black text-foreground">Jogos anteriores</h2>
          {past.length > 0 && <PageSizeSelect pageSize={pageSize} options={PAGE_SIZE_OPTIONS} />}
        </div>
        {past.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum jogo anterior ainda.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {past.map((match) => (
                <PastMatchCard key={match.id} match={match} activeOrgId={activeOrgId} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                <Link
                  href={`/time/agenda?page=${page - 1}&pageSize=${pageSize}`}
                  aria-disabled={page <= 1}
                  className={`grid size-8 place-items-center rounded-lg text-sm font-semibold transition ${
                    page <= 1
                      ? "pointer-events-none text-muted-foreground/40"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <ChevronLeft className="size-4" />
                </Link>

                {pageNumbers.map((entry, index) =>
                  entry === "ellipsis" ? (
                    <span key={`ellipsis-${index}`} className="px-1 text-sm text-muted-foreground/60">
                      …
                    </span>
                  ) : (
                    <Link
                      key={entry}
                      href={`/time/agenda?page=${entry}&pageSize=${pageSize}`}
                      className={`grid size-8 place-items-center rounded-lg text-sm font-bold transition ${
                        entry === page
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {entry}
                    </Link>
                  ),
                )}

                <Link
                  href={`/time/agenda?page=${page + 1}&pageSize=${pageSize}`}
                  aria-disabled={page >= totalPages}
                  className={`grid size-8 place-items-center rounded-lg text-sm font-semibold transition ${
                    page >= totalPages
                      ? "pointer-events-none text-muted-foreground/40"
                      : "text-foreground hover:bg-muted"
                  }`}
                >
                  <ChevronRight className="size-4" />
                </Link>
              </div>
            )}
          </>
        )}
      </section>

      <Link href="/time" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        <ArrowLeft className="size-4" />
        Voltar para o time
      </Link>
    </PageTransition>
  );
}

const OUTCOME_LABEL: Record<string, string> = { V: "Vitória", E: "Empate", D: "Derrota" };
const OUTCOME_CLASS: Record<string, string> = {
  V: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  E: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  D: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400",
};

function UpcomingMatchCard({ match, activeOrgId }: { match: MatchWithOrgs; activeOrgId: string }) {
  const { isHome, opponentLabel, opponentLogoUrl } = getMatchPerspective(match, activeOrgId);

  return (
    <Card className="space-y-2 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <Avatar className="size-8 shrink-0 rounded-lg bg-primary/10">
            {opponentLogoUrl && <AvatarImage src={opponentLogoUrl} alt={opponentLabel} />}
            <AvatarFallback className="rounded-lg bg-transparent">
              <Shield className="size-4 text-primary" />
            </AvatarFallback>
          </Avatar>
          <p className="truncate font-bold text-foreground">vs {opponentLabel}</p>
        </div>
        <span className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground">
          {isHome ? "Casa" : "Fora"}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CalendarDays className="size-4" />
        <span className="capitalize">{formatListingDateTime(match.scheduledAt)}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="size-4" />
        <span>{match.location}</span>
      </div>
    </Card>
  );
}

function PastMatchCard({ match, activeOrgId }: { match: MatchWithOrgs; activeOrgId: string }) {
  const { opponentLabel, opponentLogoUrl, teamScore, opponentScore, outcome } = getMatchPerspective(
    match,
    activeOrgId,
  );

  return (
    <Link href={`/time/agenda/${match.id}`} className="block h-full">
      <Card className="flex h-full flex-col justify-between gap-3 p-4 transition hover:border-muted-foreground/40">
        <div className="flex min-w-0 items-center gap-2.5">
          <Avatar className="size-9 shrink-0 rounded-lg bg-primary/10">
            {opponentLogoUrl && <AvatarImage src={opponentLogoUrl} alt={opponentLabel} />}
            <AvatarFallback className="rounded-lg bg-transparent">
              <Shield className="size-4 text-primary" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-bold text-foreground">vs {opponentLabel}</p>
            <p className="text-sm text-muted-foreground capitalize">{formatListingDateTime(match.scheduledAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {match.status === "CANCELLED" ? (
            <span className="text-sm font-semibold text-muted-foreground">Cancelado</span>
          ) : (
            <>
              {teamScore != null && opponentScore != null && (
                <span className="rounded bg-muted px-3 py-1 text-sm font-black text-foreground">
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
    </Link>
  );
}
