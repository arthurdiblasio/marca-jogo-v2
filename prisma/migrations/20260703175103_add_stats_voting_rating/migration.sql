-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "mvpUserId" TEXT,
ADD COLUMN     "votingClosedAt" TIMESTAMP(3),
ADD COLUMN     "votingClosesAt" TIMESTAMP(3),
ADD COLUMN     "votingOpenedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "PeladaOccurrence" ADD COLUMN     "votingClosedAt" TIMESTAMP(3),
ADD COLUMN     "votingClosesAt" TIMESTAMP(3),
ADD COLUMN     "votingOpenedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "PeladaPlayerStat" ADD COLUMN     "team" TEXT;

-- CreateTable
CREATE TABLE "PeladaPlayerRating" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "peladaOccurrenceId" TEXT NOT NULL,
    "raterUserId" TEXT NOT NULL,
    "ratedUserId" TEXT NOT NULL,

    CONSTRAINT "PeladaPlayerRating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchMvpVote" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "matchId" TEXT NOT NULL,
    "voterUserId" TEXT NOT NULL,
    "votedUserId" TEXT NOT NULL,

    CONSTRAINT "MatchMvpVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchPlayerRating" (
    "id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "matchId" TEXT NOT NULL,
    "raterUserId" TEXT NOT NULL,
    "ratedUserId" TEXT NOT NULL,

    CONSTRAINT "MatchPlayerRating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PeladaPlayerRating_peladaOccurrenceId_ratedUserId_idx" ON "PeladaPlayerRating"("peladaOccurrenceId", "ratedUserId");

-- CreateIndex
CREATE INDEX "PeladaPlayerRating_raterUserId_idx" ON "PeladaPlayerRating"("raterUserId");

-- CreateIndex
CREATE UNIQUE INDEX "PeladaPlayerRating_peladaOccurrenceId_raterUserId_ratedUser_key" ON "PeladaPlayerRating"("peladaOccurrenceId", "raterUserId", "ratedUserId");

-- CreateIndex
CREATE INDEX "MatchMvpVote_matchId_votedUserId_idx" ON "MatchMvpVote"("matchId", "votedUserId");

-- CreateIndex
CREATE INDEX "MatchMvpVote_voterUserId_idx" ON "MatchMvpVote"("voterUserId");

-- CreateIndex
CREATE INDEX "MatchMvpVote_votedUserId_idx" ON "MatchMvpVote"("votedUserId");

-- CreateIndex
CREATE UNIQUE INDEX "MatchMvpVote_matchId_voterUserId_key" ON "MatchMvpVote"("matchId", "voterUserId");

-- CreateIndex
CREATE INDEX "MatchPlayerRating_matchId_ratedUserId_idx" ON "MatchPlayerRating"("matchId", "ratedUserId");

-- CreateIndex
CREATE INDEX "MatchPlayerRating_raterUserId_idx" ON "MatchPlayerRating"("raterUserId");

-- CreateIndex
CREATE UNIQUE INDEX "MatchPlayerRating_matchId_raterUserId_ratedUserId_key" ON "MatchPlayerRating"("matchId", "raterUserId", "ratedUserId");

-- CreateIndex
CREATE INDEX "Match_mvpUserId_idx" ON "Match"("mvpUserId");

-- AddForeignKey
ALTER TABLE "PeladaPlayerRating" ADD CONSTRAINT "PeladaPlayerRating_peladaOccurrenceId_fkey" FOREIGN KEY ("peladaOccurrenceId") REFERENCES "PeladaOccurrence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeladaPlayerRating" ADD CONSTRAINT "PeladaPlayerRating_raterUserId_fkey" FOREIGN KEY ("raterUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeladaPlayerRating" ADD CONSTRAINT "PeladaPlayerRating_ratedUserId_fkey" FOREIGN KEY ("ratedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_mvpUserId_fkey" FOREIGN KEY ("mvpUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchMvpVote" ADD CONSTRAINT "MatchMvpVote_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchMvpVote" ADD CONSTRAINT "MatchMvpVote_voterUserId_fkey" FOREIGN KEY ("voterUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchMvpVote" ADD CONSTRAINT "MatchMvpVote_votedUserId_fkey" FOREIGN KEY ("votedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchPlayerRating" ADD CONSTRAINT "MatchPlayerRating_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchPlayerRating" ADD CONSTRAINT "MatchPlayerRating_raterUserId_fkey" FOREIGN KEY ("raterUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchPlayerRating" ADD CONSTRAINT "MatchPlayerRating_ratedUserId_fkey" FOREIGN KEY ("ratedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
