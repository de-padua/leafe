/*
  Warnings:

  - You are about to drop the column `textDescription` on the `imovel` table. All the data in the column will be lost.
  - Added the required column `description` to the `imovel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gatedCommunity_price` to the `imovel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pool_size` to the `imovel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postId` to the `imovel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "imovel" DROP COLUMN "textDescription",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "gatedCommunity_price" INTEGER NOT NULL,
ADD COLUMN     "pool_size" INTEGER NOT NULL,
ADD COLUMN     "postId" TEXT NOT NULL;
