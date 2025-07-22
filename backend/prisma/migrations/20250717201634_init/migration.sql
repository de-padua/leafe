/*
  Warnings:

  - You are about to drop the column `createdAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `preferences` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `twoFactorEnabled` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "createdAt",
DROP COLUMN "emailVerified",
DROP COLUMN "preferences",
DROP COLUMN "twoFactorEnabled";

-- CreateTable
CREATE TABLE "AccountMetadata" (
    "userId" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLogin" TIMESTAMP(3),
    "registrationIp" TEXT NOT NULL,
    "registrationDevice" TEXT NOT NULL,
    "profileVersion" INTEGER NOT NULL DEFAULT 1,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AccountMetadata_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AccountMetadata" ADD CONSTRAINT "AccountMetadata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
