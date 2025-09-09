/*
  Warnings:

  - Added the required column `typeOf` to the `imovel` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('AP', 'HOUSE');

-- AlterTable
ALTER TABLE "imovel" ADD COLUMN     "typeOf" "PropertyType" NOT NULL;
