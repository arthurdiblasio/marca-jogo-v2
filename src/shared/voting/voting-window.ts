const VOTING_WINDOW_MS = 2 * 24 * 60 * 60 * 1000;

export function computeVotingClosesAt(openedAt: Date): Date {
  return new Date(openedAt.getTime() + VOTING_WINDOW_MS);
}

export type VotingWindow = {
  votingOpenedAt: Date | null;
  votingClosesAt: Date | null;
  votingClosedAt: Date | null;
};

export function isVotingOpen(entity: VotingWindow, now: Date = new Date()): boolean {
  if (!entity.votingOpenedAt || !entity.votingClosesAt) return false;
  if (entity.votingClosedAt) return false;
  return now < entity.votingClosesAt;
}
