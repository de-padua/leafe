/*
  Warnings:

  - You are about to drop the `Imovel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `imovelImages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Imovel" DROP CONSTRAINT "Imovel_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserDetail" DROP CONSTRAINT "UserDetail_userId_fkey";

-- DropForeignKey
ALTER TABLE "imovelImages" DROP CONSTRAINT "imovelImages_imovelId_fkey";

-- DropTable
DROP TABLE "Imovel";

-- DropTable
DROP TABLE "Session";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "UserDetail";

-- DropTable
DROP TABLE "imovelImages";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "preferences";

-- CreateTable
CREATE TABLE "test" (
    "id" TEXT NOT NULL,

    CONSTRAINT "test_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "test_id_key" ON "test"("id");
