-- AlterTable
ALTER TABLE "modules" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "submodules" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;
