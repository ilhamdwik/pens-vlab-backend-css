/*
  Warnings:

  - You are about to drop the column `user_id` on the `admins` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `lecturers` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `students` table. All the data in the column will be lost.
  - You are about to drop the `user_to_role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `roles` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `admins` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nip]` on the table `lecturers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nrp]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `admins` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user_to_role" DROP CONSTRAINT "user_to_role_role_id_fkey";

-- DropForeignKey
ALTER TABLE "user_to_role" DROP CONSTRAINT "user_to_role_user_id_fkey";

-- DropForeignKey
ALTER TABLE "admins" DROP CONSTRAINT "admins_user_id_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_user_id_fkey";

-- DropForeignKey
ALTER TABLE "lecturers" DROP CONSTRAINT "lecturers_user_id_fkey";

-- DropIndex
DROP INDEX "admins_user_id_unique";

-- DropIndex
DROP INDEX "students_user_id_unique";

-- DropIndex
DROP INDEX "lecturers_user_id_unique";

-- AlterTable
ALTER TABLE "admins" DROP COLUMN "user_id",
ADD COLUMN     "email" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "lecturers" DROP COLUMN "user_id";

-- AlterTable
ALTER TABLE "students" DROP COLUMN "user_id";

-- DropTable
DROP TABLE "user_to_role";

-- DropTable
DROP TABLE "users";

-- DropTable
DROP TABLE "roles";

-- CreateIndex
CREATE UNIQUE INDEX "admins.email_unique" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "lecturers.nip_unique" ON "lecturers"("nip");

-- CreateIndex
CREATE UNIQUE INDEX "students.nrp_unique" ON "students"("nrp");
