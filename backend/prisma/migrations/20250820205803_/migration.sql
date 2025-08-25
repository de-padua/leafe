-- CreateTable
CREATE TABLE "recoveryCodes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "recoveryCodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "recoveryCodes_userId_key" ON "recoveryCodes"("userId");

-- AddForeignKey
ALTER TABLE "recoveryCodes" ADD CONSTRAINT "recoveryCodes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
