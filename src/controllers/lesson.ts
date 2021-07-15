"use strict";

import { Response, Request, NextFunction } from "express";

/**
 * Lesson / Submodules API.
 * @route GET /api/v1/lessons/:id
 */
export const getLesson = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    await req.db.user_progress.upsert({
      where: {
        student_id_submodule_id: {
          student_id: req.user.id,
          submodule_id: req.params.id,
        },
      },
      create: {
        is_done: false,
        last_answer: "",
        student_id: req.user.id,
        submodule_id: req.params.id,
      },
      update: {},
    });

    const lesson = await req.db.submodules.findFirst({
      orderBy: {
        order: "asc",
      },
      where: {
        id: req.params.id,
      },
      select: {
        title: true,
        contents: true,
        module_id: true,
        is_exercise: true,
        user_progress: {
          select: {
            is_done: true,
            last_answer: true,
          },
          where: {
            student_id: req.user.id,
          },
        },
        submodule_exercises: {
          select: {
            placeholder: true,
            id: true,
            expected_output: true,
          },
        },
        modules: {
          select: {
            id: true,
            title: true,
            prog_languages: {
              select: {
                id: true,
                name: true,
                thumbnail_url: true,
              },
            },
            submodules: {
              orderBy: {
                order: "asc",
              },
              select: {
                id: true,
                title: true,
                is_exercise: true,
                user_progress: {
                  where: {
                    student_id: req.user.id,
                  },
                },
              },
            },
          },
        },
      },
    });

    res.status(200).send(lesson);
  } catch (err) {
    next(err);
  }
};

export const postLessonProgress = async (
  req: Request<{}, {}, { id: string; answer?: string; code: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const lesson = await req.db.submodules.findUnique({
      where: {
        id: req.body.id,
      },
    });
    const answer = await req.db.submodule_exercises.findFirst({
      where: { submodule_id: req.body.id },
      select: {
        expected_output: true,
        expected_code: true,
      },
    });

    if (lesson.is_exercise) {
      let checkCode = true;
      const parsedExpectedCode: string[] = JSON.parse(answer.expected_code);

      parsedExpectedCode.forEach((v) => {
        if (!req.body.code.includes(v)) {
          checkCode = false;
        }
      });

      if (answer.expected_output !== req.body.answer) {
        res.status(400).send({ message: "Wrong output" });
        return;
      }

      if (!checkCode) {
        res.status(400).send({ message: "Wrong code" });
        return;
      }
    }

    await req.db.user_progress.upsert({
      where: {
        student_id_submodule_id: {
          student_id: req.user.id,
          submodule_id: req.body.id,
        },
      },
      create: {
        is_done: false,
        last_answer: "",
        student_id: req.user.id,
        submodule_id: req.body.id,
      },
      update: {
        is_done: true,
        last_answer: req.body.answer,
      },
    });

    res.status(200).send("ok");
  } catch (err) {
    next(err);
  }
};

// ADMIN APIs

/**
 * Lesson / Submodules API.
 * @route GET /api/v1/lessons
 */
export const adminGetLessons = async (
  req: Request<{}, {}, {}, { page?: number }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const submodules = await req.db.submodules.findMany({
      include: {
        modules: {
          include: {
            prog_languages: true,
          },
        },
      },
      skip: req.query.page ? (req.query.page - 1) * 10 : undefined,
      take: req.query.page ? 10 : undefined,
      orderBy: {
        updatedAt: "asc",
      },
    });

    const count = await req.db.submodules.count();

    res.status(200).send({ data: submodules, count: count });
  } catch (e) {
    next(e);
  }
};

/**
 * Lesson / Submodules API.
 * @route GET /api/v1/lessons/detail/:id
 */
export const adminGetDetailLesson = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    let lesson = await req.db.submodules.findFirst({
      where: { id: req.params.id },
      include: {
        submodule_exercises: true,
        modules: true,
      },
    });

    res.status(200).send(lesson);
  } catch (e) {
    next(e);
  }
};

/**
 * Lesson / Submodules API.
 * @route POST /api/v1/lessons/create
 */
export const adminPostCreateLesson = async (
  req: Request<
    {},
    {},
    {
      contents: string;
      is_exercise: boolean;
      order: number;
      title: string;
      module_id: string;
      exercise?: {
        placeholder: string;
        expected_output: string;
        expected_code: string;
      };
    }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { contents, is_exercise, module_id, order, title } = req.body;
    const lesson = await req.db.submodules.create({
      data: {
        contents,
        is_exercise,
        order,
        title,
        module_id,
      },
    });

    if (is_exercise && req.body.exercise) {
      const exercise = await req.db.submodule_exercises.create({
        data: { ...req.body.exercise, submodule_id: lesson.id },
      });

      return res.status(201).send({ ...lesson, exercise });
    }

    res.status(201).send(lesson);
  } catch (e) {
    next(e);
  }
};

/**
 * Lesson / Submodules API.
 * @route PUT /api/v1/lessons/update/:id
 */
export const adminPutUpdateLesson = async (
  req: Request<
    { id: string },
    {},
    {
      contents: string;
      is_exercise: boolean;
      order: number;
      title: string;
      module_id: string;
      exercise?: {
        placeholder: string;
        expected_output: string;
        expected_code: string;
      };
    }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { contents, is_exercise, module_id, order, title } = req.body;
    const lesson = await req.db.submodules.update({
      where: {
        id: req.params.id,
      },
      data: {
        contents,
        is_exercise,
        order,
        title,
        module_id,
      },
      include: {
        submodule_exercises: true,
      },
    });

    if (is_exercise && req.body.exercise) {
      let exercise;
      if (lesson.submodule_exercises?.id) {
        exercise = await req.db.submodule_exercises.update({
          where: {
            id: lesson.submodule_exercises.id,
          },
          data: { ...req.body.exercise, submodule_id: lesson.id },
        });
      } else {
        exercise = await req.db.submodule_exercises.create({
          data: { ...req.body.exercise, submodule_id: lesson.id },
        });
      }

      return res.status(201).send({ ...lesson, exercise });
    } else {
      const exercise = await req.db.submodule_exercises.findFirst({
        where: { submodule_id: lesson.id },
      });

      if (exercise) {
        await req.db.submodule_exercises.delete({
          where: {
            id: exercise.id,
          },
        });
      }
      return res.status(200).send(lesson);
    }

    res.status(200).send(lesson);
  } catch (e) {
    next(e);
  }
};

/**
 * Lesson / Submodules API.
 * @route DELETE /api/v1/lessons/delete/:id
 */
export const adminDeleteLesson = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const exercise = await req.db.submodule_exercises.findFirst({
      where: {
        submodule_id: req.params.id,
      },
    });
    if (exercise) {
      await req.db.submodule_exercises.delete({
        where: {
          id: exercise.id,
        },
      });
    }
    await req.db.submodules.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).send("Data deleted");
  } catch (e) {
    next(e);
  }
};
