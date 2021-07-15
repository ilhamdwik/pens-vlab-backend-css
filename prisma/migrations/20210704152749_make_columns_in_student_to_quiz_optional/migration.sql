-- AlterTable
ALTER TABLE "student_to_quiz" ADD COLUMN     "feedback" TEXT,
ALTER COLUMN "answer" DROP NOT NULL,
ALTER COLUMN "score" DROP NOT NULL,
ALTER COLUMN "code" DROP NOT NULL;
