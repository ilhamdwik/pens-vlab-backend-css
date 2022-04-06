/*
  Warnings:

  - You are about to drop the column `current_time` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `current_time` on the `forums` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "comments" DROP COLUMN "current_time";

-- AlterTable
ALTER TABLE "forums" DROP COLUMN "current_time";
