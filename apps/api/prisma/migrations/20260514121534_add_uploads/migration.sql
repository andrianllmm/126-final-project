/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `ListingImage` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[listingId,uploadId]` on the table `ListingImage` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uploadId` to the `ListingImage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ListingImage" DROP COLUMN "imageUrl",
ADD COLUMN     "uploadId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Upload" (
    "id" TEXT NOT NULL,
    "uploaderId" TEXT,
    "key" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Upload_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Upload_key_key" ON "Upload"("key");

-- CreateIndex
CREATE INDEX "Upload_uploaderId_idx" ON "Upload"("uploaderId");

-- CreateIndex
CREATE UNIQUE INDEX "ListingImage_listingId_uploadId_key" ON "ListingImage"("listingId", "uploadId");

-- AddForeignKey
ALTER TABLE "Upload" ADD CONSTRAINT "Upload_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ListingImage" ADD CONSTRAINT "ListingImage_uploadId_fkey" FOREIGN KEY ("uploadId") REFERENCES "Upload"("id") ON DELETE CASCADE ON UPDATE CASCADE;
