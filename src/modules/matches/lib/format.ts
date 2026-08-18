import type { MatchWithOrgs } from "../types";

export function getMatchPerspective(match: MatchWithOrgs, activeOrgId: string | null) {
  const isHome = match.homeOrganizationId === activeOrgId;
  const opponent = isHome ? match.awayOrganization : match.homeOrganization;
  const opponentLabel = opponent?.name ?? match.opponentName ?? "Adversário a definir";
  const opponentLogoUrl = opponent?.logoUrl ?? null;
  const teamScore = isHome ? match.homeScore : match.awayScore;
  const opponentScore = isHome ? match.awayScore : match.homeScore;
  const outcome =
    match.status === "FINISHED" && teamScore != null && opponentScore != null
      ? teamScore > opponentScore
        ? "V"
        : teamScore < opponentScore
          ? "D"
          : "E"
      : null;

  return { isHome, opponentLabel, opponentLogoUrl, teamScore, opponentScore, outcome };
}
