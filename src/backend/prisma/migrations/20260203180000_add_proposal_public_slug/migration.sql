-- AlterTable
ALTER TABLE "proposals" ADD COLUMN "publicSlug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "proposals_publicSlug_key" ON "proposals"("publicSlug");
