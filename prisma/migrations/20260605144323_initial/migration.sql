-- CreateEnum
CREATE TYPE "OrganizationType" AS ENUM ('PELADA', 'TEAM');

-- CreateEnum
CREATE TYPE "MembershipRole" AS ENUM ('OWNER', 'ADMIN', 'CAPTAIN', 'PLAYER');

-- CreateEnum
CREATE TYPE "MembershipStatus" AS ENUM ('ACTIVE', 'INVITED', 'SUSPENDED', 'LEFT');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('PENDING', 'CONFIRMED', 'DECLINED', 'WAITLISTED');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'FINISHED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MatchResult" AS ENUM ('WIN', 'DRAW', 'LOSS');

-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'CANCELLED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "FinancialTransactionType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "FinancialTransactionStatus" AS ENUM ('PENDING', 'PAID', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "imageUrl" TEXT,
    "phone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "type" "OrganizationType" NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "city" TEXT,
    "state" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "role" "MembershipRole" NOT NULL DEFAULT 'PLAYER',
    "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
    "nickname" TEXT,
    "shirtNumber" INTEGER,
    "position" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PeladaOccurrence" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "notes" TEXT,
    "isCancelled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdById" TEXT,
    "mvpUserId" TEXT,

    CONSTRAINT "PeladaOccurrence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PeladaAttendance" (
    "id" TEXT NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'PENDING',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "peladaOccurrenceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PeladaAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PeladaPlayerStat" (
    "id" TEXT NOT NULL,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER NOT NULL DEFAULT 0,
    "isMvp" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "peladaOccurrenceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "PeladaPlayerStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PeladaMvpVote" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "peladaOccurrenceId" TEXT NOT NULL,
    "voterUserId" TEXT NOT NULL,
    "votedUserId" TEXT NOT NULL,

    CONSTRAINT "PeladaMvpVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "opponentName" TEXT,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "location" TEXT NOT NULL,
    "status" "MatchStatus" NOT NULL DEFAULT 'SCHEDULED',
    "homeScore" INTEGER,
    "awayScore" INTEGER,
    "result" "MatchResult",
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "homeOrganizationId" TEXT NOT NULL,
    "awayOrganizationId" TEXT,
    "createdById" TEXT,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchAttendance" (
    "id" TEXT NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'PENDING',
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "matchId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "MatchAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchLineupEntry" (
    "id" TEXT NOT NULL,
    "position" TEXT,
    "isStarter" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "matchId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MatchLineupEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchPlayerStat" (
    "id" TEXT NOT NULL,
    "goals" INTEGER NOT NULL DEFAULT 0,
    "assists" INTEGER NOT NULL DEFAULT 0,
    "yellowCards" INTEGER NOT NULL DEFAULT 0,
    "redCards" INTEGER NOT NULL DEFAULT 0,
    "rating" DECIMAL(3,1),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "matchId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MatchPlayerStat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialTransaction" (
    "id" TEXT NOT NULL,
    "type" "FinancialTransactionType" NOT NULL,
    "status" "FinancialTransactionStatus" NOT NULL DEFAULT 'PENDING',
    "amountCents" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "organizationId" TEXT NOT NULL,
    "createdById" TEXT,

    CONSTRAINT "FinancialTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RankingSnapshot" (
    "id" TEXT NOT NULL,
    "scope" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organizationId" TEXT NOT NULL,

    CONSTRAINT "RankingSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OpponentInvite" (
    "id" TEXT NOT NULL,
    "status" "InviteStatus" NOT NULL DEFAULT 'PENDING',
    "message" TEXT,
    "scheduledAt" TIMESTAMP(3),
    "location" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fromOrganizationId" TEXT NOT NULL,
    "toOrganizationId" TEXT NOT NULL,
    "sentById" TEXT,

    CONSTRAINT "OpponentInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- CreateIndex
CREATE INDEX "Organization_type_idx" ON "Organization"("type");

-- CreateIndex
CREATE INDEX "Organization_isActive_idx" ON "Organization"("isActive");

-- CreateIndex
CREATE INDEX "Organization_createdById_idx" ON "Organization"("createdById");

-- CreateIndex
CREATE INDEX "Membership_organizationId_role_idx" ON "Membership"("organizationId", "role");

-- CreateIndex
CREATE INDEX "Membership_organizationId_status_idx" ON "Membership"("organizationId", "status");

-- CreateIndex
CREATE INDEX "Membership_userId_idx" ON "Membership"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_userId_organizationId_key" ON "Membership"("userId", "organizationId");

-- CreateIndex
CREATE INDEX "PeladaOccurrence_organizationId_scheduledAt_idx" ON "PeladaOccurrence"("organizationId", "scheduledAt");

-- CreateIndex
CREATE INDEX "PeladaOccurrence_createdById_idx" ON "PeladaOccurrence"("createdById");

-- CreateIndex
CREATE INDEX "PeladaOccurrence_mvpUserId_idx" ON "PeladaOccurrence"("mvpUserId");

-- CreateIndex
CREATE INDEX "PeladaAttendance_userId_idx" ON "PeladaAttendance"("userId");

-- CreateIndex
CREATE INDEX "PeladaAttendance_peladaOccurrenceId_status_idx" ON "PeladaAttendance"("peladaOccurrenceId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "PeladaAttendance_peladaOccurrenceId_userId_key" ON "PeladaAttendance"("peladaOccurrenceId", "userId");

-- CreateIndex
CREATE INDEX "PeladaPlayerStat_userId_idx" ON "PeladaPlayerStat"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PeladaPlayerStat_peladaOccurrenceId_userId_key" ON "PeladaPlayerStat"("peladaOccurrenceId", "userId");

-- CreateIndex
CREATE INDEX "PeladaMvpVote_peladaOccurrenceId_votedUserId_idx" ON "PeladaMvpVote"("peladaOccurrenceId", "votedUserId");

-- CreateIndex
CREATE INDEX "PeladaMvpVote_voterUserId_idx" ON "PeladaMvpVote"("voterUserId");

-- CreateIndex
CREATE INDEX "PeladaMvpVote_votedUserId_idx" ON "PeladaMvpVote"("votedUserId");

-- CreateIndex
CREATE UNIQUE INDEX "PeladaMvpVote_peladaOccurrenceId_voterUserId_key" ON "PeladaMvpVote"("peladaOccurrenceId", "voterUserId");

-- CreateIndex
CREATE INDEX "Match_homeOrganizationId_scheduledAt_idx" ON "Match"("homeOrganizationId", "scheduledAt");

-- CreateIndex
CREATE INDEX "Match_awayOrganizationId_idx" ON "Match"("awayOrganizationId");

-- CreateIndex
CREATE INDEX "Match_status_idx" ON "Match"("status");

-- CreateIndex
CREATE INDEX "Match_createdById_idx" ON "Match"("createdById");

-- CreateIndex
CREATE INDEX "MatchAttendance_organizationId_status_idx" ON "MatchAttendance"("organizationId", "status");

-- CreateIndex
CREATE INDEX "MatchAttendance_userId_idx" ON "MatchAttendance"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MatchAttendance_matchId_userId_key" ON "MatchAttendance"("matchId", "userId");

-- CreateIndex
CREATE INDEX "MatchLineupEntry_userId_idx" ON "MatchLineupEntry"("userId");

-- CreateIndex
CREATE INDEX "MatchLineupEntry_matchId_isStarter_idx" ON "MatchLineupEntry"("matchId", "isStarter");

-- CreateIndex
CREATE UNIQUE INDEX "MatchLineupEntry_matchId_userId_key" ON "MatchLineupEntry"("matchId", "userId");

-- CreateIndex
CREATE INDEX "MatchPlayerStat_userId_idx" ON "MatchPlayerStat"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MatchPlayerStat_matchId_userId_key" ON "MatchPlayerStat"("matchId", "userId");

-- CreateIndex
CREATE INDEX "FinancialTransaction_organizationId_occurredAt_idx" ON "FinancialTransaction"("organizationId", "occurredAt");

-- CreateIndex
CREATE INDEX "FinancialTransaction_organizationId_type_idx" ON "FinancialTransaction"("organizationId", "type");

-- CreateIndex
CREATE INDEX "FinancialTransaction_createdById_idx" ON "FinancialTransaction"("createdById");

-- CreateIndex
CREATE INDEX "RankingSnapshot_organizationId_scope_createdAt_idx" ON "RankingSnapshot"("organizationId", "scope", "createdAt");

-- CreateIndex
CREATE INDEX "OpponentInvite_fromOrganizationId_status_idx" ON "OpponentInvite"("fromOrganizationId", "status");

-- CreateIndex
CREATE INDEX "OpponentInvite_toOrganizationId_status_idx" ON "OpponentInvite"("toOrganizationId", "status");

-- CreateIndex
CREATE INDEX "OpponentInvite_sentById_idx" ON "OpponentInvite"("sentById");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeladaOccurrence" ADD CONSTRAINT "PeladaOccurrence_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeladaOccurrence" ADD CONSTRAINT "PeladaOccurrence_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeladaOccurrence" ADD CONSTRAINT "PeladaOccurrence_mvpUserId_fkey" FOREIGN KEY ("mvpUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeladaAttendance" ADD CONSTRAINT "PeladaAttendance_peladaOccurrenceId_fkey" FOREIGN KEY ("peladaOccurrenceId") REFERENCES "PeladaOccurrence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeladaAttendance" ADD CONSTRAINT "PeladaAttendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeladaPlayerStat" ADD CONSTRAINT "PeladaPlayerStat_peladaOccurrenceId_fkey" FOREIGN KEY ("peladaOccurrenceId") REFERENCES "PeladaOccurrence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeladaPlayerStat" ADD CONSTRAINT "PeladaPlayerStat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeladaMvpVote" ADD CONSTRAINT "PeladaMvpVote_peladaOccurrenceId_fkey" FOREIGN KEY ("peladaOccurrenceId") REFERENCES "PeladaOccurrence"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeladaMvpVote" ADD CONSTRAINT "PeladaMvpVote_voterUserId_fkey" FOREIGN KEY ("voterUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeladaMvpVote" ADD CONSTRAINT "PeladaMvpVote_votedUserId_fkey" FOREIGN KEY ("votedUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_homeOrganizationId_fkey" FOREIGN KEY ("homeOrganizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_awayOrganizationId_fkey" FOREIGN KEY ("awayOrganizationId") REFERENCES "Organization"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchAttendance" ADD CONSTRAINT "MatchAttendance_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchAttendance" ADD CONSTRAINT "MatchAttendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchAttendance" ADD CONSTRAINT "MatchAttendance_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchLineupEntry" ADD CONSTRAINT "MatchLineupEntry_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchLineupEntry" ADD CONSTRAINT "MatchLineupEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchPlayerStat" ADD CONSTRAINT "MatchPlayerStat_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchPlayerStat" ADD CONSTRAINT "MatchPlayerStat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialTransaction" ADD CONSTRAINT "FinancialTransaction_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialTransaction" ADD CONSTRAINT "FinancialTransaction_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RankingSnapshot" ADD CONSTRAINT "RankingSnapshot_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpponentInvite" ADD CONSTRAINT "OpponentInvite_fromOrganizationId_fkey" FOREIGN KEY ("fromOrganizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpponentInvite" ADD CONSTRAINT "OpponentInvite_toOrganizationId_fkey" FOREIGN KEY ("toOrganizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OpponentInvite" ADD CONSTRAINT "OpponentInvite_sentById_fkey" FOREIGN KEY ("sentById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
