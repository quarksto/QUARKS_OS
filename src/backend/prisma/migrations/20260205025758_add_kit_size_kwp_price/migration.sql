-- AlterTable: add size_kwp and price to kits (schema already had them; DB was missing columns)
ALTER TABLE "kits" ADD COLUMN "size_kwp" DOUBLE PRECISION;
ALTER TABLE "kits" ADD COLUMN "price" DOUBLE PRECISION;
