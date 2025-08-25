/*
  Warnings:

  - You are about to drop the column `codeSecret` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "recoveryCodes" ADD COLUMN     "isUsed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "user" DROP COLUMN "codeSecret";
