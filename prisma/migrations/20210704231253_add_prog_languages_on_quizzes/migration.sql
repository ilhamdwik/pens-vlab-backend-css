/*
  Warnings:

  - Added the required column `prog_languages_id` to the `quizzes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "quizzes" ADD COLUMN     "prog_languages_id" VARCHAR(50) NOT NULL;

-- AddForeignKey
ALTER TABLE "quizzes" ADD FOREIGN KEY ("prog_languages_id") REFERENCES "prog_languages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
