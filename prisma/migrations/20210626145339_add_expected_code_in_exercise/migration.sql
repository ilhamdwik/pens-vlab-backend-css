/*
  Warnings:

  - Added the required column `expected_code` to the `submodule_exercises` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "submodule_exercises" ADD COLUMN     "expected_code" TEXT NOT NULL;
