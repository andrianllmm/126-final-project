-- CreateEnum
CREATE TYPE "UserEventType" AS ENUM ('VIEW', 'CLICK', 'LIKE', 'MESSAGE', 'PURCHASE', 'SEARCH');

-- DropIndex
DROP INDEX "Listing_embedding_hnsw_idx";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "embedding" vector(384),
ADD COLUMN     "embeddingUpdatedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "UserEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "listingId" TEXT,
    "eventType" "UserEventType" NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserEvent_userId_createdAt_idx" ON "UserEvent"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "UserEvent_listingId_eventType_idx" ON "UserEvent"("listingId", "eventType");

-- AddForeignKey
ALTER TABLE "UserEvent" ADD CONSTRAINT "UserEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserEvent" ADD CONSTRAINT "UserEvent_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
