-- DropForeignKey
ALTER TABLE "lecturers" DROP CONSTRAINT "lecturers_class_id_fkey";

-- AlterTable
ALTER TABLE "lecturers" ALTER COLUMN "class_id" DROP NOT NULL,
ALTER COLUMN "class_id" SET DATA TYPE TEXT;
