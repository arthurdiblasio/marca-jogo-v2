-- AlterTable
ALTER TABLE "Membership" ADD COLUMN     "isMonthly" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "monthlyFee" DECIMAL(10,2),
ADD COLUMN     "scheduledTime" TEXT,
ADD COLUMN     "singleFee" DECIMAL(10,2),
ADD COLUMN     "weekday" INTEGER;
