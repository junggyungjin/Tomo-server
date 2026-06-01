/*
  Warnings:

  - You are about to drop the column `maxParicipants` on the `CallRoom` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CallRoom" DROP COLUMN "maxParicipants",
ADD COLUMN     "maxParticipants" INTEGER NOT NULL DEFAULT 4;
