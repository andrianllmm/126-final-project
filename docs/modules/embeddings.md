# Embeddings Module

Turns text into vectors so other modules can do similarity search.

## What it does

`EmbeddingsService` (`apps/api/src/modules/embeddings/embeddings.service.ts`) wraps a local model, `Xenova/all-MiniLM-L6-v2`, run in-process via `@xenova/transformers`. No external API, no per-call cost.

```ts
embedText(text: string): Promise<number[]>
```

Returns a 384-dimension vector. The model loads once on first use and stays cached.

## Who uses it

The Search module uses it to embed listings and search queries. That's it for now, it's a small shared utility, not a domain module.

## Notes

Nothing here talks to the database or knows about listings. It just turns text into numbers. Keep it that way.
