/*
  Warnings:

  - You are about to drop the column `position` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `primaryModality` on the `Profile` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Profile_position_idx";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "position",
DROP COLUMN "primaryModality";

-- CreateTable
CREATE TABLE "ProfileModality" (
    "id" TEXT NOT NULL,
    "modality" "SportModality" NOT NULL,
    "positions" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "ProfileModality_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProfileModality_profileId_idx" ON "ProfileModality"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileModality_profileId_modality_key" ON "ProfileModality"("profileId", "modality");

-- AddForeignKey
ALTER TABLE "ProfileModality" ADD CONSTRAINT "ProfileModality_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
