-- CreateTable
CREATE TABLE "student_to_lecturer" (
    "assigned_id" VARCHAR(50) NOT NULL,
    "student_id" VARCHAR(50) NOT NULL,
    "class_id" VARCHAR(50) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("assigned_id","student_id","class_id")
);

-- AddForeignKey
ALTER TABLE "student_to_lecturer" ADD FOREIGN KEY ("assigned_id") REFERENCES "lecturers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_to_lecturer" ADD FOREIGN KEY ("student_id") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_to_lecturer" ADD FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
