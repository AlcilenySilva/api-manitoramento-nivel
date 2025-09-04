-- CreateTable
CREATE TABLE "public"."silo_data" (
    "id" SERIAL NOT NULL,
    "silo" TEXT NOT NULL,
    "distancia_cm" DOUBLE PRECISION NOT NULL,
    "porcentagem" DOUBLE PRECISION NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "silo_data_pkey" PRIMARY KEY ("id")
);
