/*
  Warnings:

  - The `position` column on the `Profile` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SportModality" AS ENUM ('FIELD_11', 'SOCIETY_7', 'SOCIETY_8', 'FUTSAL_5');

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "modality" "SportModality";

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "onboardingCompletedAt" TIMESTAMP(3),
ADD COLUMN     "onboardingStep" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "primaryModality" "SportModality",
DROP COLUMN "position",
ADD COLUMN     "position" TEXT;

-- DropEnum
DROP TYPE "Position";

-- CreateIndex
CREATE INDEX "Profile_position_idx" ON "Profile"("position");
