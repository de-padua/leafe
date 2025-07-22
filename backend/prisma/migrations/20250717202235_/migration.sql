/*
  Warnings:

  - You are about to drop the `AccountMetadata` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[recoveryEmail]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[recoveryPhone]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AccountMetadata" DROP CONSTRAINT "AccountMetadata_userId_fkey";

-- DropIndex
DROP INDEX "user_id_key";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "bio" DROP NOT NULL,
ALTER COLUMN "profilePictureUrl" DROP NOT NULL;

-- DropTable
DROP TABLE "AccountMetadata";

-- CreateTable
CREATE TABLE "accountMetadata" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "twoFactorSecret" TEXT,
    "registrationIp" VARCHAR(45),
    "registrationDevice" VARCHAR(512),
    "deviceHash" TEXT,
    "lastLogin" TIMESTAMP(3),
    "lastLoginIp" VARCHAR(45),
    "loginCount" INTEGER NOT NULL DEFAULT 0,
    "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
    "profileVersion" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "passwordUpdatedAt" TIMESTAMP(3),
    "accountLockedUntil" TIMESTAMP(3),

    CONSTRAINT "accountMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accountMetadata_userId_key" ON "accountMetadata"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "accountMetadata_deviceHash_key" ON "accountMetadata"("deviceHash");

-- CreateIndex
CREATE INDEX "accountMetadata_userId_idx" ON "accountMetadata"("userId");

-- CreateIndex
CREATE INDEX "accountMetadata_createdAt_idx" ON "accountMetadata"("createdAt");

-- CreateIndex
CREATE INDEX "accountMetadata_lastLogin_idx" ON "accountMetadata"("lastLogin");

-- CreateIndex
CREATE UNIQUE INDEX "user_recoveryEmail_key" ON "user"("recoveryEmail");

-- CreateIndex
CREATE UNIQUE INDEX "user_recoveryPhone_key" ON "user"("recoveryPhone");

-- CreateIndex
CREATE INDEX "user_email_idx" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_createdAt_idx" ON "user"("createdAt");

-- AddForeignKey
ALTER TABLE "accountMetadata" ADD CONSTRAINT "accountMetadata_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
