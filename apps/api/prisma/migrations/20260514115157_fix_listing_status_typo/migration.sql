/*
  Warnings:

  - The values [qD] on the enum `ListingStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ListingStatus_new" AS ENUM ('DRAFT', 'AVAILABLE', 'RESERVED', 'SOLD', 'ARCHIVED');
ALTER TABLE "public"."Listing" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Listing" ALTER COLUMN "status" TYPE "ListingStatus_new" USING ("status"::text::"ListingStatus_new");
ALTER TYPE "ListingStatus" RENAME TO "ListingStatus_old";
ALTER TYPE "ListingStatus_new" RENAME TO "ListingStatus";
DROP TYPE "public"."ListingStatus_old";
ALTER TABLE "Listing" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;
