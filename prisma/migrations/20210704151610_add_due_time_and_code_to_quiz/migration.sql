/*
  Warnings:

  - Added the required column `due_time` to the `quizzes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `student_to_quiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "quizzes" ADD COLUMN     "due_time" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "student_to_quiz" ADD COLUMN     "code" TEXT NOT NULL;
