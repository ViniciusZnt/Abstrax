-- AlterTable
ALTER TABLE "Art" ADD COLUMN     "imageData" BYTEA,
ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "mimeType" TEXT,
ADD COLUMN     "tags" TEXT[];
