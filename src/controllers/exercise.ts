"use strict";

import { submodule_exercises } from "@prisma/client";
import { Response, Request, NextFunction } from "express";

/**
 * Exercises API.
 * @route GET /api/v1/admin/exercise
 */
export const adminGetExercises = async (
  req: Request<{}, {}, {}, { page?: number }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const exercises = await req.db.submodule_exercises.findMany({
      skip: req.query.page ? (req.query.page - 1) * 10 : undefined,
      take: req.query.page ? 10 : undefined,
      orderBy: {
        updatedAt: "asc",
      },
    });

    const count = await req.db.submodule_exercises.count();

    res.status(200).send({ data: exercises, count: count });
  } catch (e) {
    next(e);
  }
};

/**
 * Exercises API.
 * @route GET /api/v1/admin/exercise/detail/:id
 */
export const adminGetDetailExercise = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const exercise = await req.db.submodule_exercises.findFirst({
      where: { id: req.params.id },
    });

    res.status(200).send(exercise);
  } catch (e) {
    next(e);
  }
};

/**
 * Exercises API.
 * @route POST /api/v1/admin/exercise/create
 */
export const adminPostCreateExercise = async (
  req: Request<{}, {}, submodule_exercises>,
  res: Response,
  next: NextFunction
) => {
  try {
    const exercise = await req.db.submodule_exercises.create({
      data: req.body,
    });

    res.status(201).send(exercise);
  } catch (e) {
    next(e);
  }
};

/**
 * Exercises API.
 * @route PUT /api/v1/admin/exercise/update/:id
 */
export const adminPutUpdateExercise = async (
  req: Request<{ id: string }, {}, submodule_exercises>,
  res: Response,
  next: NextFunction
) => {
  try {
    const exercise = await req.db.submodule_exercises.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });

    res.status(200).send(exercise);
  } catch (e) {
    next(e);
  }
};

/**
 * Exercises API.
 * @route DELETE /api/v1/admin/exercise/delete/:id
 */
export const adminDeleteExercise = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    await req.db.submodule_exercises.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).send("Data deleted");
  } catch (e) {
    next(e);
  }
};
