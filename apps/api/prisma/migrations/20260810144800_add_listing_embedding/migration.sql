-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "embedding" vector(384);

-- CreateIndex
CREATE INDEX "Listing_embedding_hnsw_idx" ON "Listing" USING hnsw ("embedding" vector_cosine_ops);
