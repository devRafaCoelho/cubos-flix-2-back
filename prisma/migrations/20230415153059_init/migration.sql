/*
  Warnings:

  - You are about to drop the column `movieID` on the `Favorites` table. All the data in the column will be lost.
  - You are about to drop the column `movieName` on the `Favorites` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Favorites" DROP COLUMN "movieID",
DROP COLUMN "movieName",
ADD COLUMN     "movie_id" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "poster_path" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "title" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "vote_average" DOUBLE PRECISION NOT NULL DEFAULT 0;
