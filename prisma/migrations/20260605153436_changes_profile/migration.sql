/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Position" AS ENUM ('GOALKEEPER', 'DEFENDER', 'FULLBACK', 'MIDFIELDER', 'WINGER', 'STRIKER');

-- CreateEnum
CREATE TYPE "PreferredFoot" AS ENUM ('LEFT', 'RIGHT', 'BOTH');

-- AlterTable
ALTER TABLE "User" DROP COLUMN "imageUrl",
DROP COLUMN "name",
DROP COLUMN "phone";

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "nickname" TEXT,
    "imageUrl" TEXT,
    "phone" TEXT,
    "birthDate" TIMESTAMP(3),
    "city" TEXT,
    "state" TEXT,
    "position" "Position",
    "preferredFoot" "PreferredFoot",
    "shirtNumber" INTEGER,
    "bio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE INDEX "Profile_fullName_idx" ON "Profile"("fullName");

-- CreateIndex
CREATE INDEX "Profile_city_state_idx" ON "Profile"("city", "state");

-- CreateIndex
CREATE INDEX "Profile_position_idx" ON "Profile"("position");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
