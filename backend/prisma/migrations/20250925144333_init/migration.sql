/*
  Warnings:

  - Added the required column `imageName` to the `imovelImages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageSize` to the `imovelImages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageType` to the `imovelImages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."imovelImages" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "imageName" TEXT NOT NULL,
ADD COLUMN     "imageSize" INTEGER NOT NULL,
ADD COLUMN     "imageType" TEXT NOT NULL;
