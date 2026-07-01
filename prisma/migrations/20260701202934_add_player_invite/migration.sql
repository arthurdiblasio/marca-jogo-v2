-- CreateTable
CREATE TABLE "PlayerInvite" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "status" "InviteStatus" NOT NULL DEFAULT 'PENDING',
    "role" "MembershipRole" NOT NULL DEFAULT 'PLAYER',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "organizationId" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "usedByUserId" TEXT,

    CONSTRAINT "PlayerInvite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlayerInvite_token_key" ON "PlayerInvite"("token");

-- CreateIndex
CREATE INDEX "PlayerInvite_token_idx" ON "PlayerInvite"("token");

-- CreateIndex
CREATE INDEX "PlayerInvite_organizationId_status_idx" ON "PlayerInvite"("organizationId", "status");

-- AddForeignKey
ALTER TABLE "PlayerInvite" ADD CONSTRAINT "PlayerInvite_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerInvite" ADD CONSTRAINT "PlayerInvite_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerInvite" ADD CONSTRAINT "PlayerInvite_usedByUserId_fkey" FOREIGN KEY ("usedByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
