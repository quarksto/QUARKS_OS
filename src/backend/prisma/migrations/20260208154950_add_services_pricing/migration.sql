-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('INSTALLATION', 'ENGINEERING', 'HOMOLOGATION', 'FREIGHT', 'INSURANCE', 'OTHER');

-- CreateEnum
CREATE TYPE "ServicePriceType" AS ENUM ('FIXED', 'PER_WATT', 'PER_KM', 'PERCENT');

-- AlterTable
ALTER TABLE "proposals" ADD COLUMN     "hardwareCost" DOUBLE PRECISION,
ADD COLUMN     "marginAmount" DOUBLE PRECISION,
ADD COLUMN     "servicesCost" DOUBLE PRECISION,
ADD COLUMN     "servicesDetails" JSONB,
ADD COLUMN     "taxAmount" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ServiceType" NOT NULL,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_prices" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "state" TEXT,
    "minPower" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "maxPower" DOUBLE PRECISION NOT NULL DEFAULT 99999,
    "priceType" "ServicePriceType" NOT NULL,
    "priceValue" DOUBLE PRECISION NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_prices_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "service_prices" ADD CONSTRAINT "service_prices_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
