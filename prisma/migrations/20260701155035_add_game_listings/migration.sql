-- CreateEnum
CREATE TYPE "GameListingStatus" AS ENUM ('OPEN', 'MATCHED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "GameListingResponseStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED');

-- CreateEnum
CREATE TYPE "GameListingFrequency" AS ENUM ('DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY');

-- CreateTable
CREATE TABLE "GameListingSeries" (
    "id" TEXT NOT NULL,
    "frequency" "GameListingFrequency" NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isCancelled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdById" TEXT,

    CONSTRAINT "GameListingSeries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameListing" (
    "id" TEXT NOT NULL,
    "modality" "SportModality" NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "lat" DECIMAL(10,7),
    "lng" DECIMAL(10,7),
    "priceCents" INTEGER,
    "priceNotes" TEXT,
    "notes" TEXT,
    "status" "GameListingStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdById" TEXT,
    "seriesId" TEXT,
    "matchId" TEXT,

    CONSTRAINT "GameListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameListingPhoto" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "gameListingId" TEXT NOT NULL,
    "gameListingSeriesId" TEXT,

    CONSTRAINT "GameListingPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameListingResponse" (
    "id" TEXT NOT NULL,
    "status" "GameListingResponseStatus" NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "gameListingId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "respondedById" TEXT,

    CONSTRAINT "GameListingResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GameListingSeries_organizationId_idx" ON "GameListingSeries"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "GameListing_matchId_key" ON "GameListing"("matchId");

-- CreateIndex
CREATE INDEX "GameListing_status_scheduledAt_idx" ON "GameListing"("status", "scheduledAt");

-- CreateIndex
CREATE INDEX "GameListing_city_state_status_idx" ON "GameListing"("city", "state", "status");

-- CreateIndex
CREATE INDEX "GameListing_organizationId_status_idx" ON "GameListing"("organizationId", "status");

-- CreateIndex
CREATE INDEX "GameListing_seriesId_idx" ON "GameListing"("seriesId");

-- CreateIndex
CREATE INDEX "GameListingPhoto_gameListingId_idx" ON "GameListingPhoto"("gameListingId");

-- CreateIndex
CREATE INDEX "GameListingResponse_gameListingId_status_idx" ON "GameListingResponse"("gameListingId", "status");

-- CreateIndex
CREATE INDEX "GameListingResponse_organizationId_idx" ON "GameListingResponse"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "GameListingResponse_gameListingId_organizationId_key" ON "GameListingResponse"("gameListingId", "organizationId");

-- AddForeignKey
ALTER TABLE "GameListingSeries" ADD CONSTRAINT "GameListingSeries_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameListingSeries" ADD CONSTRAINT "GameListingSeries_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameListing" ADD CONSTRAINT "GameListing_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameListing" ADD CONSTRAINT "GameListing_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameListing" ADD CONSTRAINT "GameListing_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "GameListingSeries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameListing" ADD CONSTRAINT "GameListing_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameListingPhoto" ADD CONSTRAINT "GameListingPhoto_gameListingId_fkey" FOREIGN KEY ("gameListingId") REFERENCES "GameListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameListingPhoto" ADD CONSTRAINT "GameListingPhoto_gameListingSeriesId_fkey" FOREIGN KEY ("gameListingSeriesId") REFERENCES "GameListingSeries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameListingResponse" ADD CONSTRAINT "GameListingResponse_gameListingId_fkey" FOREIGN KEY ("gameListingId") REFERENCES "GameListing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameListingResponse" ADD CONSTRAINT "GameListingResponse_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameListingResponse" ADD CONSTRAINT "GameListingResponse_respondedById_fkey" FOREIGN KEY ("respondedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
