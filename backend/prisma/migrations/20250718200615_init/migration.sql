/*
  Warnings:

  - You are about to drop the column `passwordUpdatedAt` on the `accountMetadata` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "accountMetadata" DROP COLUMN "passwordUpdatedAt";
