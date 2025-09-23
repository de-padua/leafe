/*
  Warnings:

  - You are about to drop the column `typeOf` on the `imovel` table. All the data in the column will be lost.
  - Added the required column `type` to the `imovel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "imovel" DROP COLUMN "typeOf",
ADD COLUMN     "type" "PropertyType" NOT NULL;
