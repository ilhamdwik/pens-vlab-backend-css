// import { getUserDetail } from "./user";
// import * as compilerApi from "./compiler";
import { NextFunction, Request, Response } from "express";
import * as authApi from "./auth";
import * as classesApi from "./classes";
import * as coursesApi from "./courses";
import * as exercisesApi from "./exercise";
import * as lecturersApi from "./lecturers";
import * as lessonApi from "./lesson";
import * as modulesApi from "./modules";
import * as quizzesApi from "./quizzes";
import * as studentsApi from "./students";
import * as forumsApi from "./forums";
import * as commentsApi from "./comments";

/**
 * Classes API.
 * @route GET /api/v1/get-time/
 */
const getTimeApi = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const time = new Date().getTime();
    res.status(200).send({ time });
  } catch (e) {
    next(e);
  }
};

export const controllers = {
  ...authApi,
  ...classesApi,
  // ...compilerApi,
  ...coursesApi,
  ...exercisesApi,
  ...lecturersApi,
  ...lessonApi,
  ...modulesApi,
  ...quizzesApi,
  ...studentsApi,
  ...forumsApi,
  ...commentsApi,
  getTimeApi,
};
