/*
  Warnings:

  - You are about to drop the column `userProfilePicture` on the `user` table. All the data in the column will be lost.
  - Added the required column `profilePictureUrl` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "userProfilePicture",
ADD COLUMN     "profilePictureUrl" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "imovel" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "postedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdate" TIMESTAMP(3) NOT NULL,
    "textDescription" TEXT NOT NULL,
    "log" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "estate" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "CEP" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "IPTU" DOUBLE PRECISION NOT NULL,
    "rooms" INTEGER NOT NULL,
    "bathrooms" INTEGER NOT NULL,
    "garage" INTEGER NOT NULL,
    "bedrooms" INTEGER NOT NULL,
    "floors" INTEGER NOT NULL,
    "age" INTEGER NOT NULL,
    "stage" INTEGER NOT NULL,
    "furnished" BOOLEAN NOT NULL,
    "pool" BOOLEAN NOT NULL,
    "gym" BOOLEAN NOT NULL,
    "security" BOOLEAN NOT NULL,
    "elevator" BOOLEAN NOT NULL,
    "accessible" BOOLEAN NOT NULL,
    "balcony" BOOLEAN NOT NULL,
    "garden" BOOLEAN NOT NULL,
    "barbecueArea" BOOLEAN NOT NULL,
    "solarEnergy" BOOLEAN NOT NULL,
    "library" BOOLEAN NOT NULL,
    "wineCellar" BOOLEAN NOT NULL,
    "airConditioning" BOOLEAN NOT NULL,
    "smartHome" BOOLEAN NOT NULL,
    "laundryRoom" BOOLEAN NOT NULL,
    "gatedCommunity" BOOLEAN NOT NULL,
    "alarmSystem" BOOLEAN NOT NULL,
    "surveillanceCameras" BOOLEAN NOT NULL,
    "fingerprintAccess" BOOLEAN NOT NULL,
    "solarPanels" BOOLEAN NOT NULL,
    "chargingStation" BOOLEAN NOT NULL,
    "partyRoom" BOOLEAN NOT NULL,
    "guestParking" BOOLEAN NOT NULL,
    "petArea" BOOLEAN NOT NULL,
    "bikeRack" BOOLEAN NOT NULL,
    "coWorkingSpace" BOOLEAN NOT NULL,
    "petFriendly" BOOLEAN NOT NULL,
    "area" INTEGER NOT NULL,
    "built" INTEGER NOT NULL,
    "views" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL,
    "isFeatured" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "imovel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imovelImages" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imovelId" TEXT NOT NULL,

    CONSTRAINT "imovelImages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "imovel_id_key" ON "imovel"("id");

-- CreateIndex
CREATE UNIQUE INDEX "imovelImages_id_key" ON "imovelImages"("id");

-- AddForeignKey
ALTER TABLE "imovel" ADD CONSTRAINT "imovel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imovelImages" ADD CONSTRAINT "imovelImages_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imovel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
