/*
  Warnings:

  - You are about to drop the column `name` on the `classes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[kelas]` on the table `classes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[program]` on the table `classes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[jurusan]` on the table `classes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `jurusan` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kelas` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `program` to the `classes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `submodules` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "classes.name_unique";

-- AlterTable
ALTER TABLE "classes" DROP COLUMN "name",
ADD COLUMN     "jurusan" VARCHAR(255) NOT NULL,
ADD COLUMN     "kelas" VARCHAR(255) NOT NULL,
ADD COLUMN     "program" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "prog_languages" ALTER COLUMN "description" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "submodules" ADD COLUMN     "title" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "classes.kelas_unique" ON "classes"("kelas");

-- CreateIndex
CREATE UNIQUE INDEX "classes.program_unique" ON "classes"("program");

-- CreateIndex
CREATE UNIQUE INDEX "classes.jurusan_unique" ON "classes"("jurusan");
