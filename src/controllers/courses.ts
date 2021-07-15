"use strict";

import { Response, Request, NextFunction } from "express";
import { UploadedFile } from "express-fileupload";
import FormData from "form-data";
import fs from "fs";
/**
 * Courses / Programming Languages API.
 * @route GET /api/v1/courses
 */
export const getAllCourses = async (
  req: Request<{}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const courses = await req.db.prog_languages.findMany({
      select: {
        name: true,
        id: true,
        description: true,
        thumbnail_url: true,
        modules: {
          select: {
            title: true,
            id: true,
            submodules: {
              select: {
                id: true,
                user_progress: {
                  where: {
                    student_id: req.user.id,
                  },
                  select: {
                    is_done: true,
                  },
                },
              },
            },
          },
        },
      },
      
    });

    

    res.status(200).send(courses);
  } catch (err) {
    next(err);
  }
};

/**
 * Courses / Programming Languages API.
 * @route GET /api/v1/courses/:id
 */
export const getCourseDetail = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const course = await req.db.prog_languages.findFirst({
      where: {
        id: req.params.id,
      },
      select: {
        name: true,
        description: true,
        thumbnail_url: true,
        id: true,
        modules: {
          orderBy: {
            order: "asc",
          },
          select: {
            title: true,
            id: true,
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

    res.status(200).send(course);
  } catch (err) {
    next(err);
  }
};

// ADMIN APIs

/**
 * Courses / Programming Languages API.
 * @route GET /api/v1/admin/courses
 */
export const adminGetCourses = async (
  req: Request<{}, {}, {}, { page?: number }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const courses = await req.db.prog_languages.findMany({
      skip: req.query.page ? (req.query.page - 1) * 10 : undefined,
      take: req.query.page ? 10 : undefined,
      orderBy: {
        updatedAt: "asc",
      },
    });

    const count = await req.db.prog_languages.count();

    res.status(200).send({ data: courses, count: count });
  } catch (e) {
    next(e);
  }
};

/**
 * Courses / Programming Languages API.
 * @route GET /api/v1/admin/courses/detail/:id
 */
export const adminGetDetailCourse = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const course = await req.db.prog_languages.findFirst({
      where: { id: req.params.id },
      include: {
        modules: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    res.status(200).send(course);
  } catch (e) {
    next(e);
  }
};

/**
 * Courses / Programming Languages API.
 * @route POST /api/v1/admin/courses/create
 */
export const adminPostCreateCourse = async (
  req: Request<
    {},
    {},
    {
      description: string;
      id: string;
      name: string;
    }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { description, id, name } = req.body;

    const file = req.files.thumbnail as UploadedFile;
    const fileName =
      new Date().getTime() + (file.mimetype === "image/jpeg" ? ".jpg" : ".png");

    await file.mv(process.cwd() + "/public/images/" + fileName);

    const course = await req.db.prog_languages.create({
      data: {
        description,
        id,
        name,
        thumbnail_url: "/images/" + fileName,
      },
    });

    res.status(201).send(course);
  } catch (e) {
    next(e);
  }
};

/**
 * Courses / Programming Languages API.
 * @route PUT /api/v1/admin/courses/update/:id
 */
export const adminPutUpdateCourse = async (
  req: Request<
    { id: string },
    {},
    {
      description: string;
      id: string;
      name: string;
    }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const { description, id, name } = req.body;

    const file = req.files?.thumbnail as UploadedFile;
    const fileName = file
      ? new Date().getTime() +
        (file.mimetype === "image/jpeg" ? ".jpg" : ".png")
      : undefined;

    if (file) {
      await file.mv(process.cwd() + "/public/images/" + fileName);
    }

    const course = await req.db.prog_languages.update({
      where: {
        id: req.params.id,
      },
      data: {
        description,
        id,
        name,
        thumbnail_url: file ? "/images/" + fileName : undefined,
      },
    });

    res.status(200).send(course);
  } catch (e) {
    next(e);
  }
};

/**
 * Courses / Programming Languages API.
 * @route DELETE /api/v1/admin/courses/delete/:id
 */
export const adminDeleteCourse = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const course = await req.db.prog_languages.findFirst({
      where: {
        id: req.params.id,
      },
    });

    fs.unlinkSync(process.cwd() + "/public" + course.thumbnail_url);

    await req.db.prog_languages.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).send("Data deleted");
  } catch (e) {
    next(e);
  }
};
