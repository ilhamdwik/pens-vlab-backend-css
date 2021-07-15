/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `lecturers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[submodule_id]` on the table `submodule_exercises` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "lecturers_user_id_unique" ON "lecturers"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "students_user_id_unique" ON "students"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "submodule_exercises_submodule_id_unique" ON "submodule_exercises"("submodule_id");
