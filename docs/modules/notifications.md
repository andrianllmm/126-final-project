# Notifications Module

In-app notifications plus web push. Two separate delivery paths for one concept, worth keeping straight.

## In-app (REST + websocket)

Notifications are created by other modules (transactions, offers, messaging) calling `NotificationsService.create()` or `createWithTx()` when something happens. Types: `MESSAGE`, `TRANSACTION`, `SYSTEM`, `RATING`.

REST:

- `GET /notifications`: list, optional `?read=true/false` filter
- `GET /notifications/unread`
- `GET /notifications/count`
- `PATCH /notifications/:id/read`
- `PATCH /notifications/read-all`

Websocket (`NotificationsGateway`, namespace `/notifications`): same connect-with-session pattern as messaging. After creating a notification, call `emitNotificationCreated()` so it shows up live for the user without a page refresh. That's a manual step, the service doesn't auto-emit, callers have to do it (see `emitCreated()` calls in transactions/offers/messaging services).

## Web push

Separate from the in-app stuff above. Users subscribe their browser via `POST /notifications/push/subscribe` (stores a `PushSubscription` row), unsubscribe via `DELETE /notifications/push/unsubscribe`.

`sendPushToUser()` sends an actual push notification through the browser's push service, works even if the user has no tab open. Uses VAPID keys, set via env vars, checked at call time in `ensureVapidSet()`.

There's also `POST /notifications/push/send-test` for manually triggering a test push, useful when debugging subscription setup.

## Note

In-app notifications and push notifications aren't linked automatically, a caller can send one without the other. Right now nothing in the codebase sends both for the same event, so keep that in mind if you're adding a new notification type.
