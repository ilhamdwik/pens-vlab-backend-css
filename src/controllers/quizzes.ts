"use strict";

import { quizzes, students, student_to_quiz } from "@prisma/client";
import { Response, Request, NextFunction } from "express";
import moment from "moment";

export const getQuizzes = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const quiz = await req.db.student_to_quiz.findMany({
      orderBy: {
        createdAt: 'asc',
      },
      where: {
        student_id: req.user.id,
      },
      include: {
        quizzes: {
          include: {
            lecturers: {
              select: {
                name: true,
              },
            },
            prog_languages: {
              select: {
                name: true,
                thumbnail_url: true,
              },
            },
            classes: {
              select: {
                jurusan: true,
                kelas: true,
                program: true,
              },
            },
          },
        },
      },
    });

    
    res.status(200).send(quiz);
  } catch (e) {
    next(e);
  }
};

export const getQuizDetail = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const quiz = await req.db.student_to_quiz.findUnique({
      where: {
        student_id_quiz_id: {
          student_id: req.user.id,
          quiz_id: req.params.id,
        },
      },
      include: {
        quizzes: {
          include: {
            lecturers: {
              select: {
                name: true,
              },
            },
            prog_languages: {
              select: {
                name: true,
                thumbnail_url: true,
              },
            },
            classes: {
              select: {
                jurusan: true,
                kelas: true,
                program: true,
              },
            },
          },
        },
      },
    });

    res.status(200).send(quiz);
  } catch (e) {
    next(e);
  }
};

export const postSubmitQuiz = async (
  req: Request<{ id: string }, {}, { code: string; answer: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const quiz = await req.db.quizzes.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (moment().isAfter(quiz.due_time)) {
      return res.status(403).send("Oops time's up!");
    }
    await req.db.student_to_quiz.update({
      where: {
        student_id_quiz_id: {
          student_id: req.user.id,
          quiz_id: req.params.id,
        },
      },
      data: {
        answer: req.body.answer,
        code: req.body.code,
        is_submitted: true,
        time_submitted: new Date(),
      },
    });

    res.status(200).send();
  } catch (e) {
    next(e);
  }
};

// ADMIN API

/**
 * Quizzes API.
 * @route GET /api/v1/admin/quizzes
 */
export const adminGetQuizzes = async (
  req: Request<{}, {}, {}, { page?: number }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const quizzes = await req.db.quizzes.findMany({
      where: {
        assignee_id: req.user.id,
      },
      include: {
        student_to_quiz: true,
        classes: true,
        lecturers: true,
      },
      skip: req.query.page ? (req.query.page - 1) * 10 : undefined,
      take: req.query.page ? 10 : undefined,
      orderBy: {
        due_time: "asc",
      },
    });

    const count = await req.db.quizzes.count();

    res.status(200).send({ data: quizzes, count: count });
  } catch (e) {
    next(e);
  }
};

/**
 * Quizzes API.
 * @route GET /api/v1/admin/quizzes/detail/:id
 */
export const adminGetDetailQuiz = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const quiz = await req.db.quizzes.findFirst({
      where: { id: req.params.id },
      include: {
        student_to_quiz: {
          include: {
            students: true,
          },
          orderBy: {
            is_submitted: "desc",
          },
        },
      },
    });

    res.status(200).send(quiz);
  } catch (e) {
    next(e);
  }
};

/**
 * Quizzes API.
 * @route POST /api/v1/admin/quizzes/create
 */
export const adminPostCreateQuiz = async (
  req: Request<
    {},
    {},
    {
      assignee_id: string;
      title: string;
      class_id: string;
      question: string;
      due_time: Date;
      assigned_students: students[];
      prog_languages_id: string;
    }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const quiz = await req.db.quizzes.create({
      data: {
        due_time: req.body.due_time,
        assignee_id: req.body.assignee_id,
        title: req.body.title,
        class_id: req.body.class_id,
        question: req.body.question,
        prog_languages_id: req.body.prog_languages_id,
      },
    });

    await req.db.student_to_quiz.createMany({
      data: req.body.assigned_students.map((v) => ({
        student_id: v.id,
        quiz_id: quiz.id,
        is_submitted: false,
      })),
    });

    res.status(201).send(quiz);
  } catch (e) {
    next(e);
  }
};

/**
 * Quizzes API.
 * @route PUT /api/v1/admin/quizzes/update/:id
 */
export const adminPutUpdateQuiz = async (
  req: Request<
    { id: string },
    {},
    quizzes & {
      assigned_students: students[];
    }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const quiz = await req.db.quizzes.update({
      where: {
        id: req.params.id,
      },
      data: {
        due_time: req.body.due_time,
        assignee_id: req.body.assignee_id,
        title: req.body.title,
        class_id: req.body.class_id,
        question: req.body.question,
        prog_languages_id: req.body.prog_languages_id,
      },
    });

    await req.db.student_to_quiz.createMany({
      data: req.body.assigned_students.map((v) => ({
        student_id: v.id,
        quiz_id: quiz.id,
        is_submitted: false,
      })),
    });

    res.status(200).send(quiz);
  } catch (e) {
    next(e);
  }
};

/**
 * Quizzes API.
 * @route DELETE /api/v1/admin/quizzes/delete/:id
 */
export const adminDeleteQuiz = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    await req.db.student_to_quiz.deleteMany({
      where: {
        quiz_id: req.params.id,
      },
    });

    await req.db.quizzes.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).send("Data deleted");
  } catch (e) {
    next(e);
  }
};

export const adminGetSubmission = async (
  req: Request<{ quizId: string; studentId: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const submission = await req.db.student_to_quiz.findFirst({
      where: {
        quiz_id: req.params.quizId,
        student_id: req.params.studentId,
      },
      include: {
        quizzes: true,
        students: {
          include: {
            classes: true,
          },
        },
      },
    });

    res.status(200).send(submission);
  } catch (e) {
    next(e);
  }
};

export const adminUpdateSubmission = async (
  req: Request<
    { quizId: string; studentId: string },
    {},
    { score?: number; feedback?: string }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.body.score > 100 || req.body.score < 0) {
      return res.status(400).send("Score Invalid");
    }

    await req.db.student_to_quiz.update({
      where: {
        student_id_quiz_id: {
          quiz_id: req.params.quizId,
          student_id: req.params.studentId,
        },
      },
      data: {
        score: req.body.score,
        feedback: req.body.feedback,
      },
    });

    await res.status(200).send();
  } catch (e) {
    next(e);
  }
};
