"use strict";

import { classes } from "@prisma/client";
import { Response, Request, NextFunction } from "express";

/**
 * Classes API.
 * @route GET /api/v1/admin/classes
 */
export const adminGetClasses = async (
  req: Request<{}, {}, {}, { page?: number }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const classes = await req.db.classes.findMany({
      skip: req.query.page ? (req.query.page - 1) * 10 : undefined,
      take: req.query.page ? 10 : undefined,
      orderBy: {
        updatedAt: "asc",
      },
    });

    const count = await req.db.classes.count();

    res.status(200).send({ data: classes, count: count });
  } catch (e) {
    next(e);
  }
};

/**
 * Classes API.
 * @route GET /api/v1/admin/classes/detail/:id
 */
export const adminGetDetailClass = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const classData = await req.db.classes.findFirst({
      where: { id: req.params.id },
    });

    res.status(200).send(classData);
  } catch (e) {
    next(e);
  }
};

/**
 * Classes API.
 * @route GET /api/v1/admin/classes/students-in-class/:id
 */
export const adminGetStudentsInClass = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const classData = await req.db.classes.findFirst({
      where: { id: req.params.id },
      include: {
        students: true,
      },
    });

    res.status(200).send(classData);
  } catch (e) {
    next(e);
  }
};

/**
 * Classes API.
 * @route POST /api/v1/admin/classes/create
 */
export const adminPostCreateClass = async (
  req: Request<{}, {}, classes>,
  res: Response,
  next: NextFunction
) => {
  try {
    const classData = await req.db.classes.create({
      data: req.body,
    });

    res.status(201).send(classData);
  } catch (e) {
    next(e);
  }
};

/**
 * Classes API.
 * @route PUT /api/v1/admin/classes/update/:id
 */
export const adminPutUpdateClass = async (
  req: Request<{ id: string }, {}, classes>,
  res: Response,
  next: NextFunction
) => {
  try {
    const classData = await req.db.classes.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });

    res.status(200).send(classData);
  } catch (e) {
    next(e);
  }
};

/**
 * Classes API.
 * @route DELETE /api/v1/admin/classes/delete/:id
 */
export const adminDeleteClass = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    await req.db.classes.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).send("Data deleted");
  } catch (e) {
    next(e);
  }
};
