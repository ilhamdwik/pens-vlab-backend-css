"use strict";

import { students } from "@prisma/client";
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
