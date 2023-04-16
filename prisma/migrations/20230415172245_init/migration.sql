/*
  Warnings:

  - A unique constraint covering the columns `[movie_id]` on the table `Favorites` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Favorites" ALTER COLUMN "movie_id" DROP DEFAULT,
ALTER COLUMN "poster_path" DROP DEFAULT,
ALTER COLUMN "title" DROP DEFAULT,
ALTER COLUMN "vote_average" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Favorites_movie_id_key" ON "Favorites"("movie_id");
