"use strict";

import { Response, Request, NextFunction } from "express";

/**
 * Students API.
 * @route GET /api/v1/admin/students
 */
export const adminGetStudents = async (
  req: Request<{}, {}, {}, { page?: number }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const students = await req.db.students.findMany({
      include: {
        classes: true,
      },
      skip: req.query.page ? (req.query.page - 1) * 10 : undefined,
      take: req.query.page ? 10 : undefined,
      orderBy: {
        nrp: "asc",
      },
    });

    const count = await req.db.students.count();

    res.status(200).send({ data: students, count: count });
  } catch (e) {
    next(e);
  }
};

/**
 * Students API.
 * @route GET /api/v1/lecturer/students
 */
 export const lecturerGetStudents = async (
  req: Request<{}, {}, {}, { page?: number }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const student_to_lecturers = await req.db.student_to_lecturer.findMany({
      skip: req.query.page ? (req.query.page - 1) * 10 : undefined,
      take: req.query.page ? 10 : undefined,
      where: {
        assigned_id: req.user.id,
      },
      include: {
        students: {
          include: {
            classes: {
              select: {
                kelas: true,
                program: true,
              },
            },
          },
        },
      },
    });

    const count = await req.db.student_to_lecturer.count();

    res.status(200).send({ data: student_to_lecturers, count: count });
  } catch (e) {
    next(e);
  }
};

/**
 * Students API.
 * @route GET /api/v1/admin/students/detail/:id
 */
export const adminGetDetailStudent = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const student = await req.db.students.findFirst({
      where: { id: req.params.id },
      include: {
        classes: true,
      },
    });

    res.status(200).send(student);
  } catch (e) {
    next(e);
  }
};


/**
 * Students API.
 * @route GET /api/v1/lecturer/students/detail/:id
 */
 export const lecturerGetDetailStudent = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const submodule = await req.db.submodules.findMany({});

    const user_progress = await req.db.user_progress.findMany({
      where: {
        student_id: req.params.id,
        is_done: true,
      },
    });

    let studentProgress = ((user_progress.length / submodule.length) * 100);

    const student_to_lecturer = await req.db.student_to_lecturer.findFirst({
      where: { 
        student_id: req.params.id 
      },
      include: {
        students: {
          include: {
            classes: {
              select: {
                kelas: true,
                program: true,
              },
            },
          },
        },
      },
    });

    res.status(200).send({ data: student_to_lecturer, studentProgress: studentProgress });
  } catch (e) {
    next(e);
  }
};

/**
 * Students API.
 * @route POST /api/v1/admin/students/create
 */
export const adminPostCreateStudent = async (
  req: Request<
    {},
    {},
    { class_id: string; name: string; nrp: string; email: string }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const student = await req.db.students.create({
      data: {
        name: req.body.name,
        nrp: req.body.nrp,
        class_id: req.body.class_id,
      },
    });

    res.status(201).send(student);
  } catch (e) {
    next(e);
  }
};

/**
 * Students API.
 * @route PUT /api/v1/admin/students/update/:id
 */
export const adminPutUpdateStudent = async (
  req: Request<
    { id: string },
    {},
    { class_id: string; name: string; nrp: string }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const student = await req.db.students.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });

    res.status(200).send(student);
  } catch (e) {
    next(e);
  }
};

/**
 * Students API.
 * @route DELETE /api/v1/admin/students/delete/:id
 */
export const adminDeleteStudent = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    await req.db.user_progress.deleteMany({
      where: {
        student_id: req.params.id,
      },
    });

    await req.db.student_to_quiz.deleteMany({
      where: {
        student_id: req.params.id,
      },
    });

    await req.db.comments.deleteMany({
      where: {
        student_id: req.params.id,
      },
    });

    await req.db.forums.deleteMany({
      where: {
        author_id: req.params.id,
      },
    });

    await req.db.students.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).send("Data deleted");
  } catch (e) {
    next(e);
  }
};
