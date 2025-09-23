/*
  Warnings:

  - Added the required column `isFinan` to the `imovel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "imovel" ADD COLUMN     "financeBanks" TEXT[],
ADD COLUMN     "isFinan" BOOLEAN NOT NULL;
