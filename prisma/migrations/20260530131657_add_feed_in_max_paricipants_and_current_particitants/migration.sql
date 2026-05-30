/*
  Warnings:

  - You are about to drop the `callRoom` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('OPEN', 'CLOSED');

-- DropForeignKey
ALTER TABLE "callRoom" DROP CONSTRAINT "callRoom_feedId_fkey";

-- DropTable
DROP TABLE "callRoom";

-- CreateTable
CREATE TABLE "CallRoom" (
    "id" TEXT NOT NULL,
    "feedId" TEXT NOT NULL,
    "status" "RoomStatus" NOT NULL DEFAULT 'OPEN',
    "maxParicipants" INTEGER NOT NULL DEFAULT 4,
    "currentParticipants" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CallRoom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CallRoom_feedId_key" ON "CallRoom"("feedId");

-- AddForeignKey
ALTER TABLE "CallRoom" ADD CONSTRAINT "CallRoom_feedId_fkey" FOREIGN KEY ("feedId") REFERENCES "Feed"("id") ON DELETE CASCADE ON UPDATE CASCADE;
