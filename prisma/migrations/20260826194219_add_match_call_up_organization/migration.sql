/*
  Warnings:

  - Added the required column `organizationId` to the `MatchCallUp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MatchCallUp" ADD COLUMN     "organizationId" TEXT;

-- Backfill existing rows from the match's home organization (best-effort, pre-existing test data)
UPDATE "MatchCallUp" mcu
SET "organizationId" = m."homeOrganizationId"
FROM "Match" m
WHERE m.id = mcu."matchId";

ALTER TABLE "MatchCallUp" ALTER COLUMN "organizationId" SET NOT NULL;

-- CreateIndex
CREATE INDEX "MatchCallUp_organizationId_idx" ON "MatchCallUp"("organizationId");

-- AddForeignKey
ALTER TABLE "MatchCallUp" ADD CONSTRAINT "MatchCallUp_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
