-- AlterTable
ALTER TABLE "proposals" ADD COLUMN     "acceptedAt" TIMESTAMP(3),
ADD COLUMN     "discountAbsolute" DOUBLE PRECISION,
ADD COLUMN     "discountPercent" DOUBLE PRECISION,
ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "rejectedAt" TIMESTAMP(3),
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "sentAt" TIMESTAMP(3),
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "viewedAt" TIMESTAMP(3);
