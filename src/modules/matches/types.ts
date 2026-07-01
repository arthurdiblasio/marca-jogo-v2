import type { matchRepository } from "./repositories/match-repository";

export type MatchWithOrgs = Awaited<ReturnType<typeof matchRepository.listUpcomingByOrganization>>[number];
