import type { playerInviteRepository } from "./repositories/player-invite-repository";

export type PlayerInviteSummary = Awaited<ReturnType<typeof playerInviteRepository.listActiveByOrganization>>[number];
export type PlayerInviteDetail = NonNullable<Awaited<ReturnType<typeof playerInviteRepository.findByToken>>>;
