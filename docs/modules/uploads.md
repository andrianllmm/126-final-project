# Uploads Module

## Purpose

The Uploads module is responsible for handling file uploads, storage abstraction, and metadata persistence.

It is a backend infrastructure module and is NOT responsible for file delivery logic, CDN management, or domain-specific media rules.

---

## System Flow

### Upload Pipeline

1. HTTP multipart request received
2. Multer parses file payload (Nest FileInterceptor)
3. Validation layer rejects invalid files
4. Adapter normalizes file into `UploadFile`
5. UploadsService orchestrates upload workflow
6. StorageProvider persists file (Local or S3)
7. Prisma stores upload metadata

---

## Domain Model

### UploadFile (Input Contract)

Represents a normalized file object used internally across the system.

Defined in `uploads/types/upload-file.ts`.

This type is framework-agnostic and decouples business logic from Multer.

---

### UploadResult (Storage Output)

Represents the result returned after a successful storage operation.

Defined in `uploads/types/upload-result.ts`.

Contains storage key, public URL, and optional metadata (size, dimensions).

---

### StorageProvider (Infrastructure Contract)

Defines the interface for all storage implementations.

Defined in `uploads/storage/storage.provider.ts`.

```ts
interface StorageProvider {
  upload(file: UploadFile): Promise<UploadResult>;
  delete(key: string): Promise<void>;
}
```

---

## Storage Implementations

### LocalStorageProvider

Located in `uploads/storage/local.storage.ts`.

- Stores files on local filesystem
- Generates URL using server base path
- Suitable for development

---

### S3StorageProvider

Located in `uploads/storage/s3.storage.ts`.

- Uses AWS S3 compatible API
- Works with Supabase Storage and Cloudflare R2
- Requires `forcePathStyle: true`
- Returns CDN/public URL

---

## HTTP API

### Upload File

```
POST /uploads
```

**Request:**

- Content-Type: multipart/form-data
- Field name: `file`

**Response:**

```json
{
  "id": "upload_id",
  "key": "file-key.jpg",
  "url": "https://...",
  "mimeType": "image/jpeg",
  "size": 12345,
  "width": 1920,
  "height": 1080,
  "uploaderId": "user_id"
}
```

---

### Delete Upload

```
DELETE /uploads/:id
```

**Behavior:**

- Removes file from storage provider
- Deletes database record
- Enforces ownership check

**Responses:**

- `200 OK` — success
- `404 Not Found` — upload does not exist
- `403 Forbidden` — user does not own upload

---

## Validation Rules

Validation is enforced at multiple layers:

### 1. Transport Layer (Multer)

- Maximum file size: 5MB

### 2. Validation Pipe

- Allowed MIME types:
  - image/jpeg
  - image/png
  - image/webp

### 3. Service Layer

- Defensive re-validation of file constraints

---

## Persistence Model

Uploads are stored in the `upload` table.

Each record contains:

- Storage key
- Public URL
- MIME type
- File size
- Optional uploader reference

Uploads are referenced by domain models (e.g. `ListingImage`) rather than storing raw URLs directly.

---

## Usage Pattern

Uploads are never consumed directly by clients. Instead, they are referenced by domain entities.

### Example: Listing Integration

```ts
const upload = await uploadsService.upload(file, userId);

await prisma.listingImage.create({
  data: {
    listingId,
    uploadId: upload.id,
  },
});
```
