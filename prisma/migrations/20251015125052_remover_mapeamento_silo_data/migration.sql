/*
  Warnings:

  - You are about to drop the `silo_data` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."silo_data";

-- CreateTable
CREATE TABLE "public"."nivel" (
    "id" SERIAL NOT NULL,
    "silo_name" TEXT NOT NULL DEFAULT 'Desconhecido',
    "distancia_cm" DOUBLE PRECISION NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "nivel_pkey" PRIMARY KEY ("id")
);
