/*
  Warnings:

  - The primary key for the `Favorites` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[movie_id,userId]` on the table `Favorites` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Favorites" DROP CONSTRAINT "Favorites_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "Favorites_movie_id_userId_key" ON "Favorites"("movie_id", "userId");
