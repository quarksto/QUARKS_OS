/*
  Warnings:

  - You are about to drop the column `clientId` on the `leads` table. All the data in the column will be lost.
  - You are about to drop the column `contentType` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `mentions` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `read` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `readAt` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `readBy` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `replyToId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `senderType` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `proposals` table. All the data in the column will be lost.
  - You are about to drop the column `hardwareCost` on the `proposals` table. All the data in the column will be lost.
  - You are about to drop the column `introduction` on the `proposals` table. All the data in the column will be lost.
  - You are about to drop the column `marginAmount` on the `proposals` table. All the data in the column will be lost.
  - You are about to drop the column `paymentTerms` on the `proposals` table. All the data in the column will be lost.
  - You are about to drop the column `pricingDetails` on the `proposals` table. All the data in the column will be lost.
  - You are about to drop the column `servicesCost` on the `proposals` table. All the data in the column will be lost.
  - You are about to drop the column `servicesDetails` on the `proposals` table. All the data in the column will be lost.
  - You are about to drop the column `taxAmount` on the `proposals` table. All the data in the column will be lost.
  - You are about to drop the `clients` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lead_documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `message_templates` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code]` on the table `services` will be added. If there are existing duplicate values, this will fail.
  - Made the column `leadId` on table `projects` required. This step will fail if there are existing NULL values in that column.
  - Made the column `paybackYears` on table `proposals` required. This step will fail if there are existing NULL values in that column.
  - Made the column `savingsMonthly` on table `proposals` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `priceType` on the `service_prices` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `services` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "lead_documents" DROP CONSTRAINT "lead_documents_leadId_fkey";

-- DropForeignKey
ALTER TABLE "leads" DROP CONSTRAINT "leads_clientId_fkey";

-- DropForeignKey
ALTER TABLE "message_templates" DROP CONSTRAINT "message_templates_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_leadId_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_replyToId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_clientId_fkey";

-- DropForeignKey
ALTER TABLE "projects" DROP CONSTRAINT "projects_leadId_fkey";

-- DropIndex
DROP INDEX "messages_leadId_createdAt_idx";

-- DropIndex
DROP INDEX "messages_senderId_idx";

-- AlterTable
ALTER TABLE "leads" DROP COLUMN "clientId";

-- AlterTable
ALTER TABLE "messages" DROP COLUMN "contentType",
DROP COLUMN "mentions",
DROP COLUMN "metadata",
DROP COLUMN "read",
DROP COLUMN "readAt",
DROP COLUMN "readBy",
DROP COLUMN "replyToId",
DROP COLUMN "senderType",
DROP COLUMN "updatedAt",
ADD COLUMN     "isRead" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'USER';

-- AlterTable
ALTER TABLE "projects" DROP COLUMN "clientId",
ALTER COLUMN "leadId" SET NOT NULL;

-- AlterTable
ALTER TABLE "proposals" DROP COLUMN "expiresAt",
DROP COLUMN "hardwareCost",
DROP COLUMN "introduction",
DROP COLUMN "marginAmount",
DROP COLUMN "paymentTerms",
DROP COLUMN "pricingDetails",
DROP COLUMN "servicesCost",
DROP COLUMN "servicesDetails",
DROP COLUMN "taxAmount",
ALTER COLUMN "paybackYears" SET NOT NULL,
ALTER COLUMN "savingsMonthly" SET NOT NULL;

-- AlterTable
ALTER TABLE "service_prices" DROP COLUMN "priceType",
ADD COLUMN     "priceType" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "services" ADD COLUMN     "baseCost" DOUBLE PRECISION,
ADD COLUMN     "code" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- DropTable
DROP TABLE "clients";

-- DropTable
DROP TABLE "lead_documents";

-- DropTable
DROP TABLE "message_templates";

-- DropEnum
DROP TYPE "ContentType";

-- DropEnum
DROP TYPE "SenderType";

-- DropEnum
DROP TYPE "ServicePriceType";

-- DropEnum
DROP TYPE "ServiceType";

-- CreateIndex
CREATE UNIQUE INDEX "services_code_key" ON "services"("code");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
