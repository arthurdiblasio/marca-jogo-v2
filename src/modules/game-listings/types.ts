import type { gameListingRepository } from "./repositories/game-listing-repository";

export type GameListingSummary = Awaited<ReturnType<typeof gameListingRepository.listOpen>>[number];
export type GameListingDetail = NonNullable<Awaited<ReturnType<typeof gameListingRepository.findById>>>;
