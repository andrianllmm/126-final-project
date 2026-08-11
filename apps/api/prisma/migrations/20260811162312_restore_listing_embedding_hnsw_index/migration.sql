-- Restore the HNSW index dropped by the previous migration.
-- Listing.embedding is an Unsupported("vector(384)") field, so this index
-- is not modeled in schema.prisma and Prisma treats it as drift on any
-- `migrate dev` regeneration. Recreating it here restores similarity-search
-- performance; a future migration touching this table should double check
-- the generated SQL for an unintended DROP INDEX on it.
CREATE INDEX "Listing_embedding_hnsw_idx" ON "Listing" USING hnsw ("embedding" vector_cosine_ops);
