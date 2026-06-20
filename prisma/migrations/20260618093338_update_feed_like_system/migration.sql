-- AlterTable
ALTER TABLE "Feed" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "likeCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "FeedLike" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "feedId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "FeedLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FeedLike_feedId_idx" ON "FeedLike"("feedId");

-- CreateIndex
CREATE UNIQUE INDEX "FeedLike_userId_feedId_key" ON "FeedLike"("userId", "feedId");

-- AddForeignKey
ALTER TABLE "FeedLike" ADD CONSTRAINT "FeedLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedLike" ADD CONSTRAINT "FeedLike_feedId_fkey" FOREIGN KEY ("feedId") REFERENCES "Feed"("id") ON DELETE CASCADE ON UPDATE CASCADE;
