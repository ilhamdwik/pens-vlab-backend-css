/*
  Warnings:

  - Added the required column `class_id` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "comments" ADD COLUMN     "class_id" VARCHAR(50) NOT NULL;

-- AddForeignKey
ALTER TABLE "comments" ADD FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
