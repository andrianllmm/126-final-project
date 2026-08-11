# Search Module

Handles listing discovery: browsing, filters, keyword search, semantic search, and similar-listings.

## GET /search

Defined in `search.controller.ts` / `search.service.ts`. Powers the homepage feed and the search results page.

No `q` param: plain filter and sort by status, category, condition, price range. Nothing fancy.

With a `q` param: the query gets embedded (via the Embeddings module) and listings are ranked by how close their embedding is to it. So "cheap laptop" can match a listing titled "Budget Notebook" even with no shared words. Listings without an embedding yet just get skipped in semantic results.

## GET /listings/:id/similar

Defined in `listings.controller.ts` / `listings.service.ts` (`findSimilar`). Given a listing, finds other available listings with the closest embedding. Shown on the listing detail page.

## Listing.embedding

Each listing gets a `vector(384)` column, computed from its title and description whenever it's created or edited. This happens in the background after the write, so it never slows down the request. If it fails, it just logs and moves on.

## Setup

Needs the `pgvector` Postgres extension and an HNSW index on `Listing.embedding` for fast approximate search. Both are set up via raw SQL in migrations since Prisma can't model vector types or indexes natively.

Heads up: because that index isn't in `schema.prisma`, Prisma treats it as drift. If you regenerate a migration touching `Listing`, check the generated SQL doesn't quietly drop it.

## Frontend

- `global-search-bar.tsx`: navbar search input, submits to `/search?q=...`
- `listing-search-page.tsx`: results page, same endpoint for both filter and semantic modes
- `similar-listings.tsx`: similar-listings section on the listing detail page

Sort control is hidden while a keyword search is active since ranking already handles that.
