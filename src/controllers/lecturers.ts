"use strict";

import { lecturers, students } from "@prisma/client";
import { Response, Request, NextFunction } from "express";

/**
 * Lecturer API.
 * @route GET /api/v1/admin/lecturer
 */
export const adminGetLecturer = async (
  req: Request<{}, {}, {}, { page?: number }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const lecturers = await req.db.lecturers.findMany({
      skip: req.query.page ? (req.query.page - 1) * 10 : undefined,
      take: req.query.page ? 10 : undefined,
      orderBy: {
        updatedAt: "asc",
      },
    });

    const count = await req.db.lecturers.count();

    res.status(200).send({ data: lecturers, count: count });
  } catch (e) {
    next(e);
  }
};

/**
 * Lecturer API.
 * @route GET /api/v1/admin/lecturer/detail/:id
 */
export const adminGetDetailLecturer = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const lecturer = await req.db.lecturers.findFirst({
      where: { id: req.params.id },
    });

    res.status(200).send(lecturer);
  } catch (e) {
    next(e);
  }
};

/**
 * Lecturer API.
 * @route POST /api/v1/admin/lecturer/create
 */
export const adminPostCreateLecturer = async (
  req: Request<
    {},
    {},
    {
      name: string;
      position: string;
      nip: string;
    }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const lecturer = await req.db.lecturers.create({
      data: {
        name: req.body.name,
        nip: req.body.nip,
        position: req.body.position,
      },
    });

    res.status(201).send(lecturer);
  } catch (e) {
    next(e);
  }
};

/**
 * Lecturer API.
 * @route PUT /api/v1/admin/lecturer/update/:id
 */
export const adminPutUpdateLecturer = async (
  req: Request<{ id: string }, {}, lecturers>,
  res: Response,
  next: NextFunction
) => {
  try {
    const lecturer = await req.db.lecturers.update({
      where: {
        id: req.params.id,
      },
      data: {
        name: req.body.name,
        nip: req.body.nip,
        position: req.body.position,
      },
    });

    res.status(200).send(lecturer);
  } catch (e) {
    next(e);
  }
};

/**
 * Lecturer API.
 * @route DELETE /api/v1/admin/lecturer/delete/:id
 */
export const adminDeleteLecturer = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    // await req.db.student_to_lecturer.deleteMany({
    //   where: {
    //     assigned_id: req.params.id,
    //   },
    // });

    await req.db.lecturers.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).send("Data deleted");
  } catch (e) {
    next(e);
  }
};

/**
 * Lecturer API.
 * @route POST /api/v1/lecturer/student/create
 */
export const lecturerPostCreateStudent = async (
  req: Request<
    { id: string },
    {},
    {
      class_id: string;
      assigned_id: string;
      assigned_students: students[];
    }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const getLecturers = await req.db.lecturers.findFirst({
      where: {
        class_id: req.body.class_id,
      }
    });

    if(getLecturers){
      res.status(400).send({ message: "Kelas Sudah memiliki dosen pengampu" });
      return;
    }

    const lecturer = await req.db.lecturers.update({
      where: {
        id: req.user.id,
      },
      data: {
        class_id: req.body.class_id,
      },
    });

    await req.db.student_to_lecturer.createMany({
      data: req.body.assigned_students.map((v) => ({
        assigned_id: lecturer.id,
        student_id: v.id,
      })),
    });

    res.status(201).send(lecturer);
  } catch (e) {
    next(e);
  }
};

/**
 * Lecturer API.
 * @route PUT /api/v1/lecturer/student/update
 */
export const lecturerPutUpdateStudent = async (
  req: Request<
    {}, 
    {}, 
    {
      class_id: string;
      assigned_id: string;
      assigned_students: students[];
    }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const getLecturers = await req.db.lecturers.findFirst({
      where: {
        class_id: req.body.class_id,
      }
    });

    if(getLecturers){
      res.status(400).send({ message: "Kelas Sudah memiliki dosen pengampu" });
      return;
    }

    const lecturer = await req.db.lecturers.update({
      where: {
        id: req.user.id,
      },
      data: {
        class_id: req.body.class_id,
      },
    });

    await req.db.student_to_lecturer.deleteMany({
      where: {
        assigned_id: lecturer.id,
      },
    });

    await req.db.student_to_lecturer.createMany({
      data: req.body.assigned_students.map((v) => ({
        assigned_id: lecturer.id,
        student_id: v.id,
      })),
    });
    
    res.status(200).send(lecturer);
  } catch (e) {
    next(e);
  }
};