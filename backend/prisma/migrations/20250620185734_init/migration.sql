-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'MODERATOR');

-- CreateEnum
CREATE TYPE "preferences" AS ENUM ('all', 'verified');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userProfilePicture" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserDetail" (
    "id" TEXT NOT NULL,
    "city" TEXT,
    "state" TEXT,
    "preferences" "preferences" NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "UserDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Imovel" (
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

    CONSTRAINT "Imovel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imovelImages" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imovelId" TEXT NOT NULL,

    CONSTRAINT "imovelImages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserDetail_id_key" ON "UserDetail"("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserDetail_userId_key" ON "UserDetail"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_id_key" ON "Session"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Session_userId_key" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Imovel_id_key" ON "Imovel"("id");

-- CreateIndex
CREATE UNIQUE INDEX "imovelImages_id_key" ON "imovelImages"("id");

-- AddForeignKey
ALTER TABLE "UserDetail" ADD CONSTRAINT "UserDetail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Imovel" ADD CONSTRAINT "Imovel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imovelImages" ADD CONSTRAINT "imovelImages_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imovel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
