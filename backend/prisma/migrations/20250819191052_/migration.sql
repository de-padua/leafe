/*
  Warnings:

  - You are about to drop the column `recoveryEmailUpdateWhen` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "recoveryEmailUpdateWhen",
ADD COLUMN     "recoveryEmailChangeAvailableWhen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
