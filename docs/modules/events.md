# Events Module

## Purpose

The Events module logs user activity (views, likes, messages, purchases, searches) and uses it to build a per-user embedding for personalized recommendations.

It is not responsible for the actual ranking logic on the homepage; that lives in the Search module and only reads `User.embedding`.

## System Flow

1. A user action happens (like a listing, send a message, complete a purchase, submit a search)
2. `EventsService.logEventAsync()` writes a `UserEvent` row, fire-and-forget so it never blocks the request
3. For likes, messages, purchases, and searches, `UserEmbeddingService.triggerRecompute()` is also called, fire-and-forget
4. `recomputeOne()` rebuilds the user's embedding from their recent events, skipping the rebuild if it already ran within the last hour

## Domain Model

### UserEvent

Defined in `prisma/schema.prisma`.

| Field       | Description                                                                        |
| ----------- | ---------------------------------------------------------------------------------- |
| `userId`    | Nullable, allows anonymous events                                                  |
| `listingId` | Nullable, absent for search events                                                 |
| `eventType` | `VIEW`, `CLICK`, `LIKE`, `MESSAGE`, `PURCHASE`, `SEARCH`                           |
| `metadata`  | Free-form JSON, used to store the query text for `SEARCH` events (`{ q: string }`) |

### User.embedding

A 384-dimension pgvector column on `User`, same type as `Listing.embedding`. Recomputed as a weighted average of:

- The embeddings of listings the user liked, messaged about, or purchased
- The text embeddings of the user's recent search queries

Each event is weighted by type and decays with age (30-day half-life), so recent and stronger signals (a purchase) matter more than older or weaker ones (a view).

## HTTP API

### Log an Event

```
POST /events
```

**Request:**

```json
{
  "eventType": "SEARCH",
  "listingId": "listing_id",
  "metadata": { "q": "calculator" }
}
```

`listingId` and `metadata` are optional. `userId` is taken from the session, not the request body.

### Get Search History

```
GET /events/search-history?limit=10
```

Returns the user's recent unique search queries, most recent first. Requires authentication.

### Clear Search History

```
DELETE /events/search-history
```

Deletes all of the user's `SEARCH` events. Requires authentication.

## Recompute Behavior

`recomputeOne(userId)` is idempotent and safe to call repeatedly. It skips the rebuild if `User.embeddingUpdatedAt` is less than an hour old, so a burst of events from one user only triggers one recompute per hour.

There is no scheduled sweep yet. `recomputeStale()` exists for that purpose but nothing calls it; wiring it to a cron job is a future task.

## Homepage Personalization

`GET /search?sortBy=forYou` (used by the homepage feed for logged-in users) reads `User.embedding` and ranks listings by similarity to it, blended with recent listings so the feed does not collapse into a single category. See `SearchService.searchPersonalized()` in the Listings module.

Users with no embedding yet (new accounts, or no recompute has run) fall back to the normal recency-sorted feed.
