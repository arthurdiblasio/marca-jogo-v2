-- AlterTable
ALTER TABLE "MatchPlayerStat" ADD COLUMN     "guestPlayerId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "PeladaPlayerStat" DROP COLUMN "team",
ADD COLUMN     "guestPlayerId" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "GuestPlayer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdById" TEXT,

    CONSTRAINT "GuestPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GuestPlayer_organizationId_idx" ON "GuestPlayer"("organizationId");

-- CreateIndex
CREATE INDEX "MatchPlayerStat_guestPlayerId_idx" ON "MatchPlayerStat"("guestPlayerId");

-- CreateIndex
CREATE UNIQUE INDEX "MatchPlayerStat_matchId_guestPlayerId_key" ON "MatchPlayerStat"("matchId", "guestPlayerId");

-- CreateIndex
CREATE INDEX "PeladaPlayerStat_guestPlayerId_idx" ON "PeladaPlayerStat"("guestPlayerId");

-- CreateIndex
CREATE UNIQUE INDEX "PeladaPlayerStat_peladaOccurrenceId_guestPlayerId_key" ON "PeladaPlayerStat"("peladaOccurrenceId", "guestPlayerId");

-- AddForeignKey
ALTER TABLE "GuestPlayer" ADD CONSTRAINT "GuestPlayer_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuestPlayer" ADD CONSTRAINT "GuestPlayer_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeladaPlayerStat" ADD CONSTRAINT "PeladaPlayerStat_guestPlayerId_fkey" FOREIGN KEY ("guestPlayerId") REFERENCES "GuestPlayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchPlayerStat" ADD CONSTRAINT "MatchPlayerStat_guestPlayerId_fkey" FOREIGN KEY ("guestPlayerId") REFERENCES "GuestPlayer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

