# Listings Module

Core listing CRUD, ownership rules, status transitions, images, and likes. Semantic search and similar-listings live in the Search module doc instead, this one's about the listing itself.

## CRUD

Standard stuff under `/listings`, plus `GET /listings/:id`. Creating or updating a listing (title/description change) kicks off embedding generation in the background, see the Search module doc.

Reads only return listings with status `AVAILABLE`, `RESERVED`, or `SOLD`, so `DRAFT` and `ARCHIVED` listings don't show up in normal browsing.

## Status transitions

`DRAFT`, `AVAILABLE`, `RESERVED`, `SOLD`, `ARCHIVED`. Allowed moves live in `listings.constants.ts`:

- `DRAFT` to `AVAILABLE` or `ARCHIVED`
- `AVAILABLE` to `RESERVED`, `SOLD`, or `ARCHIVED`
- `RESERVED` to `AVAILABLE`, `SOLD`, or `ARCHIVED`
- `SOLD` to `ARCHIVED`
- `ARCHIVED` is final

Checked in `ListingPolicy.assertValidStatusTransition()`. Note the Transactions module also pushes listings through `RESERVED`/`SOLD` directly as a side effect of accepting/completing a transaction, it doesn't go through this endpoint.

## Ownership

`ListingPolicy` is the one place that checks "does this user own this listing" (`assertOwner`, `assertOwnerByListingId`) and "can this listing be deleted" (`assertCanDelete`, blocks deleting `SOLD` or `RESERVED` listings). Used by the listing service and the images service so the rule only lives in one spot.

## Images

Separate sub-resource under `/listings/:listingId/images`, backed by `ListingImagesService`. Add (up to 10 files, 5MB each), remove, and reorder. Each add/remove/reorder call re-checks listing ownership first. Actual file storage goes through the Uploads module, this module just links uploads to a listing with a sort order.

## Likes

`POST /listings/:id/like` and `DELETE /listings/:id/like`. Simple upsert/delete on a `LikedListing` row, no extra logic. Like counts and whether the current user liked a listing get attached to every listing response via `decorateListings()` in `listing-metadata.ts`.
