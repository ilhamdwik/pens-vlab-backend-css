import express, { NextFunction, Request, Response } from "express";
import session from "express-session";
import cors from "cors";
import errorhandler from "errorhandler";
import fileUpload from "express-fileupload";
import compression from "compression";
import { PrismaClient } from "@prisma/client";
import { Express } from "express-serve-static-core";
var isProduction = process.env.NODE_ENV === "production";
import jwt from "jsonwebtoken";
import cron from "node-cron";

import { controllers } from "./controllers/";

type userPayload = {
  email: string;
  id: string;
  user_id: string;
};

declare global {
  namespace Express {
    export interface Request {
      db: PrismaClient;
      user?: userPayload;
    }
  }
}

export const createServer = async (): Promise<Express> => {
  var app = express();
  const prisma: PrismaClient = new PrismaClient();

  app.use(cors());
  app.set("port", process.env.PORT || 3001);
  app.use(
    fileUpload({
      createParentPath: true,
    })
  );
  app.use(compression());
  app.use(express.json());
  app.use(express.text());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    session({
      secret: "conduit",
      cookie: { maxAge: 60000 },
      resave: false,
      saveUninitialized: false,
    })
  );

  if (!isProduction) {
    app.use(errorhandler());
  }

  app.use(express.static("public"));

  app.use((req, _res, next) => {
    req.db = prisma;

    next();
  });

  // Get Time
  app.get("/api/v1/get-time", controllers.getTimeApi);

  //Auth middleware
  app.post("/api/v1/user/check", controllers.postCheckUser);

  const authenticateToken = async (
    req: Request<{}, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(
      token,
      process.env.SECRET_TOKEN as string,
      (
        err: any,
        user: {
          email: string;
          id: string;
          user_id: string;
        }
      ) => {
        if (err) return res.sendStatus(403);

        req.user = user;

        next();
      }
    );
  };

  const authenticateTokenLecturer = async (
    req: Request<{}, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401);

    jwt.verify(
      token,
      process.env.SECRET_TOKEN as string,
      (
        err: any,
        user: {
          email: string;
          id: string;
          user_id: string;
          nip: string;
        }
      ) => {
        if (err || !user.nip) return res.sendStatus(401);

        req.user = user;

        next();
      }
    );
  };

  // ADMIN AUTH MIDDLEWARE

  app.post("/api/v1/admin/login", controllers.postLoginAdmin);

  const authenticateTokenAdmin = async (
    req: Request<{}, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401);

    const decoded: userPayload = jwt.verify(
      token,
      process.env.SECRET_TOKEN as string
    ) as userPayload;

    const user = await req.db.admins.findUnique({
      where: {
        id: decoded.user_id,
      },
    });

    if (!user) return res.sendStatus(401);

    next();
  };

  // app.post("/api/v1/compile", authenticateToken, controllers.postCompile);
  app.get("/api/v1/courses", authenticateToken, controllers.getAllCourses);
  app.get("/api/v1/quizzes", authenticateToken, controllers.getQuizzes);
  app.get("/api/v1/quizzes/:id", authenticateToken, controllers.getQuizDetail);
  app.post(
    "/api/v1/quizzes/submit/:id",
    authenticateToken,
    controllers.postSubmitQuiz
  );
  app.get(
    "/api/v1/courses/:id",
    authenticateToken,
    controllers.getCourseDetail
  );
  app.get("/api/v1/lesson/:id", authenticateToken, controllers.getLesson);
  app.post(
    "/api/v1/lesson/update-progress",
    authenticateToken,
    controllers.postLessonProgress
  );

  // ADMIN APIs

  // classes
  app.get("/api/v1/admin/classes", controllers.adminGetClasses);
  app.get(
    "/api/v1/admin/classes/:id",
    authenticateTokenAdmin,
    controllers.adminGetDetailClass
  );
  app.get(
    "/api/v1/admin/classes/students-in-class/:id",
    authenticateTokenLecturer,
    controllers.adminGetStudentsInClass
  );
  app.post(
    "/api/v1/admin/classes/create",
    authenticateTokenAdmin,
    controllers.adminPostCreateClass
  );
  app.put(
    "/api/v1/admin/classes/update/:id",
    authenticateTokenAdmin,
    controllers.adminPutUpdateClass
  );
  app.delete(
    "/api/v1/admin/classes/delete/:id",
    authenticateTokenAdmin,
    controllers.adminDeleteClass
  );

  // courses
  app.get("/api/v1/admin/courses", controllers.adminGetCourses);
  app.get(
    "/api/v1/admin/courses/:id",
    // authenticateTokenAdmin,
    controllers.adminGetDetailCourse
  );
  app.post(
    "/api/v1/admin/courses/create",
    // authenticateTokenAdmin,
    controllers.adminPostCreateCourse
  );
  app.put(
    "/api/v1/admin/courses/update/:id",
    // authenticateTokenAdmin,
    controllers.adminPutUpdateCourse
  );
  app.delete(
    "/api/v1/admin/courses/delete/:id",
    // authenticateTokenAdmin,
    controllers.adminDeleteCourse
  );

  // exercises
  app.get(
    "/api/v1/admin/exercises",
    authenticateTokenAdmin,
    controllers.adminGetExercises
  );
  app.get(
    "/api/v1/admin/exercises/:id",
    authenticateTokenAdmin,
    controllers.adminGetDetailExercise
  );
  app.post(
    "/api/v1/admin/exercises/create",
    authenticateTokenAdmin,
    controllers.adminPostCreateExercise
  );
  app.put(
    "/api/v1/admin/exercises/update/:id",
    authenticateTokenAdmin,
    controllers.adminPutUpdateExercise
  );
  app.delete(
    "/api/v1/admin/exercises/delete/:id",
    authenticateTokenAdmin,
    controllers.adminDeleteExercise
  );

  // lecturers
  app.get(
    "/api/v1/admin/lecturers",
    authenticateTokenAdmin,
    controllers.adminGetLecturer
  );
  app.get(
    "/api/v1/admin/lecturers/:id",
    authenticateTokenAdmin,
    controllers.adminGetDetailLecturer
  );
  app.post(
    "/api/v1/admin/lecturers/create",
    authenticateTokenAdmin,
    controllers.adminPostCreateLecturer
  );
  app.put(
    "/api/v1/admin/lecturers/update/:id",
    authenticateTokenAdmin,
    controllers.adminPutUpdateLecturer
  );
  app.delete(
    "/api/v1/admin/lecturers/delete/:id",
    authenticateTokenAdmin,
    controllers.adminDeleteLecturer
  );

  // lessons
  app.get(
    "/api/v1/admin/lessons",
    // authenticateTokenAdmin,
    controllers.adminGetLessons
  );
  app.get(
    "/api/v1/admin/lessons/:id",
    // authenticateTokenAdmin,
    controllers.adminGetDetailLesson
  );
  app.post(
    "/api/v1/admin/lessons/create",
    // authenticateTokenAdmin,
    controllers.adminPostCreateLesson
  );
  app.put(
    "/api/v1/admin/lessons/update/:id",
    // authenticateTokenAdmin,
    controllers.adminPutUpdateLesson
  );
  app.delete(
    "/api/v1/admin/lessons/delete/:id",
    // authenticateTokenAdmin,
    controllers.adminDeleteLesson
  );

  // modules
  app.get(
    "/api/v1/admin/modules",
    // authenticateTokenAdmin,
    controllers.adminGetModules
  );
  app.get(
    "/api/v1/admin/modules/:id",
    // authenticateTokenAdmin,
    controllers.adminGetDetailModule
  );
  app.post(
    "/api/v1/admin/modules/create",
    // authenticateTokenAdmin,
    controllers.adminPostCreateModule
  );
  app.put(
    "/api/v1/admin/modules/update/:id",
    // authenticateTokenAdmin,
    controllers.adminPutUpdateModule
  );
  app.delete(
    "/api/v1/admin/modules/delete/:id",
    // authenticateTokenAdmin,
    controllers.adminDeleteModule
  );

  // quizzes
  app.get(
    "/api/v1/admin/quizzes",
    authenticateTokenLecturer,
    controllers.adminGetQuizzes
  );
  app.get(
    "/api/v1/admin/quizzes/:id",
    authenticateTokenLecturer,
    controllers.adminGetDetailQuiz
  );
  app.get(
    "/api/v1/admin/quizzes/submission/:quizId&:studentId",
    authenticateTokenLecturer,
    controllers.adminGetSubmission
  );
  app.put(
    "/api/v1/admin/quizzes/submission/update/:quizId&:studentId",
    authenticateTokenLecturer,
    controllers.adminUpdateSubmission
  );
  app.post(
    "/api/v1/admin/quizzes/create",
    authenticateTokenLecturer,
    controllers.adminPostCreateQuiz
  );
  app.put(
    "/api/v1/admin/quizzes/update/:id",
    authenticateTokenLecturer,
    controllers.adminPutUpdateQuiz
  );
  app.delete(
    "/api/v1/admin/quizzes/delete/:id",
    authenticateTokenLecturer,
    controllers.adminDeleteQuiz
  );

  // students
  app.get(
    "/api/v1/admin/students",
    // authenticateTokenAdmin,
    controllers.adminGetStudents
  );
  app.get(
    "/api/v1/lecturer/students",
    authenticateTokenLecturer,
    controllers.lecturerGetStudents
  );
  app.get(
    "/api/v1/admin/students/:id",
    authenticateTokenAdmin,
    controllers.adminGetDetailStudent
  );
  app.get(
    "/api/v1/lecturer/students/:id",
    authenticateTokenLecturer,
    controllers.lecturerGetDetailStudent
  );
  app.post(
    "/api/v1/admin/students/create",
    authenticateTokenAdmin,
    controllers.adminPostCreateStudent
  );
  app.put(
    "/api/v1/admin/students/update/:id",
    authenticateTokenAdmin,
    controllers.adminPutUpdateStudent
  );
  app.delete(
    "/api/v1/admin/students/delete/:id",
    authenticateTokenAdmin,
    controllers.adminDeleteStudent
  );
  app.post(
    "/api/v1/lecturer/student/create",
    authenticateTokenLecturer,
    controllers.lecturerPostCreateStudent
  );
  app.post(
    "/api/v1/lecturer/student/update",
    authenticateTokenLecturer,
    controllers.lecturerPutUpdateStudent
  );

  // Forums
  app.get(
    "/api/v1/forum/students", 
    authenticateToken,
    controllers.getAllForums
  );

  app.get(
    "/api/v1/forum/students/:id",
    authenticateToken,
    controllers.getForumsDetail
  );

  app.post(
    "/api/v1/forum/students/create",
    authenticateToken,
    controllers.postCreateForums
  );

  app.delete(
    "/api/v1/forum/students/delete/:id",
    authenticateToken,
    controllers.deleteForums
  );

  // comments
  app.get(
    "/api/v1/comments/students",
    authenticateToken,
    controllers.getComments
  );

  app.post(
    "/api/v1/comments/students/create",
    authenticateToken,
    controllers.postCreateComments
  );

  app.delete(
    "/api/v1/comments/students/delete/:id",
    authenticateToken,
    controllers.deleteComments
  );

  // Cron Job 
  cron.schedule('* * * 01 * *', async () => {
    await prisma.comments.deleteMany({});
    await prisma.forums.deleteMany({});
  });

  // ERROR FALLBACK
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    res.status(500).send("Internal Server Error!");
  });

  return app;
};
