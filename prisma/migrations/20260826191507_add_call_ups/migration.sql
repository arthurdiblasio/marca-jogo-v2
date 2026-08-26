-- CreateEnum
CREATE TYPE "CallUpStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "callUpSlots" INTEGER;

-- AlterTable
ALTER TABLE "PeladaOccurrence" ADD COLUMN     "callUpSlots" INTEGER;

-- CreateTable
CREATE TABLE "PeladaCallUp" (
    "id" TEXT NOT NULL,
    "status" "CallUpStatus" NOT NULL DEFAULT 'PENDING',
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "peladaOccurrenceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PeladaCallUp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchCallUp" (
    "id" TEXT NOT NULL,
    "status" "CallUpStatus" NOT NULL DEFAULT 'PENDING',
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "matchId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MatchCallUp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PeladaCallUp_userId_status_idx" ON "PeladaCallUp"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "PeladaCallUp_peladaOccurrenceId_userId_key" ON "PeladaCallUp"("peladaOccurrenceId", "userId");

-- CreateIndex
CREATE INDEX "MatchCallUp_userId_status_idx" ON "MatchCallUp"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "MatchCallUp_matchId_userId_key" ON "MatchCallUp"("matchId", "userId");

-- AddForeignKey
ALTER TABLE "PeladaCallUp" ADD CONSTRAINT "PeladaCallUp_peladaOccurrenceId_fkey" FOREIGN KEY ("peladaOccurrenceId") REFERENCES "PeladaOccurrence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeladaCallUp" ADD CONSTRAINT "PeladaCallUp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchCallUp" ADD CONSTRAINT "MatchCallUp_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchCallUp" ADD CONSTRAINT "MatchCallUp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
