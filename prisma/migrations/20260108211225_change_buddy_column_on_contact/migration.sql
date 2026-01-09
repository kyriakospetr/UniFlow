/*
  Warnings:

  - You are about to drop the column `buddyId` on the `Contact` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,targetUserId]` on the table `Contact` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `targetUserId` to the `Contact` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Contact" DROP CONSTRAINT "Contact_buddyId_fkey";

-- DropIndex
DROP INDEX "Contact_userId_buddyId_key";

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "buddyId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "targetUserId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Contact_userId_targetUserId_key" ON "Contact"("userId", "targetUserId");

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
