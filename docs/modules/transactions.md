# Transactions Module

Handles buying a listing: requesting it, negotiating, and completing the deal. Includes the offers sub-flow.

## Transaction states

`PENDING`, `ACCEPTED`, `REJECTED`, `COMPLETED`, `CANCELLED`. Valid moves:

- `PENDING` to `ACCEPTED`, `REJECTED`, or `CANCELLED`
- `ACCEPTED` to `COMPLETED` or `CANCELLED`
- `REJECTED`, `COMPLETED`, `CANCELLED` are final, nothing moves from these

Checked in `TransactionsService.validateStateTransition()`. Every transition also nudges the related `Listing.status` (`AVAILABLE` to `RESERVED` on accept, back to `AVAILABLE` on reject/cancel, `SOLD` on complete).

## Flow

1. Buyer creates a transaction on an `AVAILABLE` listing (`POST /transactions`). Starts as `PENDING`.
2. Either side can make offers (see below) to negotiate price, meetup spot, or time.
3. Seller accepts or rejects (`PATCH /transactions/:id/accept` or `/reject`).
4. Seller marks it complete once the exchange happens (`PATCH /transactions/:id/complete`). This also flips the listing to `SOLD` and prompts both sides to leave a review.
5. Either side can cancel before completion (`PATCH /transactions/:id/cancel`).

Every transition sends a notification to the other party.

## Offers

A separate resource under `/offers`, tied to a transaction. Either participant can propose a price, meetup location, or time. Accepting an offer:

- marks that offer `ACCEPTED` and every other pending offer on the transaction `SUPERSEDED`
- copies the offer's price/location/time onto the transaction itself
- moves the transaction to `ACCEPTED` and the listing to `RESERVED`

Offers only exist while the transaction isn't `COMPLETED` or `CANCELLED`, and you can't accept or reject your own offer.

Meetup locations are stored as PostGIS points (`Location` table), inserted through a raw SQL query since Prisma doesn't have geo types.
