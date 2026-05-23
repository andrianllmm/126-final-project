/*
  Warnings:

  - You are about to drop the column `meetupLocation` on the `Offer` table. All the data in the column will be lost.
  - You are about to drop the column `meetupLocation` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "meetupLocation",
ADD COLUMN     "meetupLocationId" INTEGER;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "meetupLocation",
ADD COLUMN     "meetupLocationId" INTEGER;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_meetupLocationId_fkey" FOREIGN KEY ("meetupLocationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_meetupLocationId_fkey" FOREIGN KEY ("meetupLocationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
