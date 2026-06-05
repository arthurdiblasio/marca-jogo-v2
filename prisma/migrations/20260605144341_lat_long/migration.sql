-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "lat" DECIMAL(10,7),
ADD COLUMN     "lng" DECIMAL(10,7);

-- AlterTable
ALTER TABLE "PeladaOccurrence" ADD COLUMN     "lat" DECIMAL(10,7),
ADD COLUMN     "lng" DECIMAL(10,7);
