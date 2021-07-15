"use strict";

import { lecturers, users } from "@prisma/client";
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
      include: {
        users: true,
      },
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
      include: {
        users: true,
      },
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
      email: string;
    }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    let user: users;
    user = await req.db.users.findUnique({
      where: { email: req.body.email },
    });

    if (!user) {
      user = await req.db.users.create({
        data: {
          email: req.body.email,
          user_to_role: {
            create: {
              role_id: "lec",
            },
          },
        },
      });
    }

    const lecturer = await req.db.lecturers.create({
      data: {
        name: req.body.name,
        nip: req.body.nip,
        position: req.body.position,
        user_id: user.id,
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
