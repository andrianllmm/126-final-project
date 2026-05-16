/*
  Warnings:

  - You are about to drop the column `image` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[avatarUploadId]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "image",
ADD COLUMN     "avatarUploadId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_avatarUploadId_key" ON "user"("avatarUploadId");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_avatarUploadId_fkey" FOREIGN KEY ("avatarUploadId") REFERENCES "Upload"("id") ON DELETE SET NULL ON UPDATE CASCADE;
