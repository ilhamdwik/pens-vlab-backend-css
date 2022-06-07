/*
  Warnings:

  - The primary key for the `student_to_lecturer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `class_id` to the `lecturers` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "student_to_lecturer" DROP CONSTRAINT "student_to_lecturer_class_id_fkey";

-- AlterTable
ALTER TABLE "lecturers" ADD COLUMN     "class_id" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "student_to_lecturer" DROP CONSTRAINT "student_to_lecturer_pkey",
ADD PRIMARY KEY ("assigned_id", "student_id");

-- AddForeignKey
ALTER TABLE "lecturers" ADD FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
