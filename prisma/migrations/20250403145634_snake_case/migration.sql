/*
  Warnings:

  - You are about to drop the column `userId` on the `picks` table. All the data in the column will be lost.
  - You are about to drop the column `pickId` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `session` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `picks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pick_id` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `reviews` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "picks" DROP CONSTRAINT "picks_fk0";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_fk0";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_fk1";

-- DropForeignKey
ALTER TABLE "session" DROP CONSTRAINT "sessions_fk0";

-- DropIndex
DROP INDEX "session_userId_key";

-- AlterTable
ALTER TABLE "picks" DROP COLUMN "userId",
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "pickId",
DROP COLUMN "userId",
ADD COLUMN     "pick_id" INTEGER NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "session" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "session_user_id_key" ON "session"("user_id");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "sessions_fk0" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "picks" ADD CONSTRAINT "picks_fk0" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_fk0" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_fk1" FOREIGN KEY ("pick_id") REFERENCES "picks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
