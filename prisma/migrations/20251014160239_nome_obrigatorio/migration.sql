/*
  Warnings:

  - Made the column `silo_name` on table `silo_data` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."silo_data" ALTER COLUMN "silo_name" SET NOT NULL,
ALTER COLUMN "silo_name" SET DEFAULT 'Desconhecido';
