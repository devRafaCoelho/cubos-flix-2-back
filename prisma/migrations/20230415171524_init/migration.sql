-- DropIndex
DROP INDEX "Favorites_movie_id_userId_key";

-- AlterTable
ALTER TABLE "Favorites" ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Favorites_pkey" PRIMARY KEY ("id");
