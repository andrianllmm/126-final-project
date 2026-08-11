# Messaging Module

In-app chat between a buyer and seller, scoped to a listing. Mix of REST for loading history and websockets for live stuff.

## Conversations

A conversation is tied to one listing and one buyer (`listingId` + `buyerId` is unique, so a buyer only ever has one thread per listing). Created lazily the first time someone messages about a listing, via `POST /messaging/conversations`.

Sellers can also start a conversation with a specific buyer through `POST /messaging/conversations/with-buyer`, useful for replying first.

## REST endpoints

- `GET /messaging/conversations`: list your conversations
- `GET /messaging/conversations/:id`: one conversation with full message history
- `POST /messaging/conversations/:id/read`: mark messages as read
- `GET /messaging/unread-count`: unread count across all conversations

## Websocket (`MessagingGateway`, namespace `/messaging`)

Auth happens on connect by reading the session from the socket handshake. No session, no connection.

Events:

- `joinConversation` / `leaveConversation`: join or leave a conversation's room to receive its events
- `sendMessage`: sends a message, broadcasts `newMessage` to everyone in that conversation's room, and echoes `messageSent` back to the sender
- `typing`: broadcasts `userTyping` to the room
- `markAsRead`: marks messages read, broadcasts `messagesRead`

The gateway also tracks who's online per user id (a user can have multiple sockets open) and broadcasts `userStatus` when someone comes online or goes fully offline.

Actually sending a message still goes through `MessagingService.sendMessage()`, same as if it came from REST, so message creation logic lives in one place.
