"use strict";

import { Response, Request, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

type userCookie = {
  id: number;
  nrp: string;
  name: string;
  kelas: number;
  program: string;
  jurusan: string;
  image: string;
  role: number;
  chat_id: string;
  iat: number;
};

/**
 * Compiler API.
 * @route POST /api/v1/auth/login-admin
 */
export const postLoginAdmin = async (
  req: Request<
    {},
    {},
    {
      email: string;
      pswd: string;
    }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await req.db.users.findUnique({
      where: {
        email: req.body.email,
      },
      include: {
        admins: true,
      },
    });

    if (!user) {
      throw "User not found";
    }

    if (!user.admins) {
      throw "Unauthorized";
    }

    const login = await bcrypt.compare(req.body.pswd, user.admins.pswd);

    if (!login) {
      throw "Unauthorized";
    }

    const token = jwt.sign(
      {
        user_id: user.id,
        email: user.email,
        name: user.admins.name,
        isAdmin: true,
      },
      process.env.SECRET_TOKEN
    );

    res.status(200).send({ token });
  } catch (err) {
    next();
  }
};

/**
 * Compiler API.
 * @route POST /api/v1/user/check
 */
export const postCheckUser = async (
  req: Request<
    {},
    {},
    {
      token: string;
      userCas: {
        email: string;
        nrp?: string;
        nip?: string;
      };
    }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    //on production change this to jwt.verify using ETHOL secret token
    const userData = (
      process.env.ETHOL_SECRET_TOKEN
        ? jwt.verify(req.body.token, process.env.ETHOL_SECRET_TOKEN)
        : jwt.decode(req.body.token)
    ) as userCookie;

    const user = await req.db.users.findUnique({
      where: { email: req.body.userCas.email },
    });

    if (user) {
      if (req.body.userCas.nip) {
        const lecturer = await req.db.lecturers.findFirst({
          where: { user_id: user.id },
        });
        const token = jwt.sign(
          { email: req.body.userCas.email, ...lecturer },
          process.env.SECRET_TOKEN
        );

        res.status(200).send({ token });
      } else if (req.body.userCas.nrp) {
        const student = await req.db.students.findFirst({
          where: { user_id: user.id },
        });

        const token = jwt.sign(
          { email: req.body.userCas.email, ...student },
          process.env.SECRET_TOKEN
        );
        res.status(200).send({ token });
      }
    } else {
      const newUser = await req.db.users.create({
        data: {
          email: req.body.userCas.email,
        },
      });

      if (req.body.userCas.nip) {
        const lecturer = await req.db.lecturers.create({
          data: {
            name: userData.name,
            nip: req.body.userCas.nip,
            position: "dosen",
            user_id: newUser.id,
          },
        });
        const token = jwt.sign(
          { email: req.body.userCas.email, ...lecturer },
          process.env.SECRET_TOKEN
        );

        res.status(200).send({ token });
      } else if (req.body.userCas.nrp) {
        const userClass = await req.db.classes.findFirst({
          where: {
            kelas: userData.kelas.toString(),
            program: userData.program,
            jurusan: userData.jurusan,
          },
        });

        if (userClass) {
          const student = await req.db.students.create({
            data: {
              name: userData.name,
              nrp: req.body.userCas.nrp,
              user_id: newUser.id,
              class_id: userClass.id,
            },
          });

          const token = jwt.sign(
            { email: req.body.userCas.email, ...student },
            process.env.SECRET_TOKEN
          );

          res.status(200).send({ token });
        } else {
          const newUserClass = await req.db.classes.create({
            data: {
              jurusan: userData.jurusan,
              kelas: userData.kelas.toString(),
              program: userData.program,
            },
          });

          const student = await req.db.students.create({
            data: {
              name: userData.name,
              nrp: req.body.userCas.nrp,
              user_id: newUser.id,
              class_id: newUserClass.id,
            },
          });

          const token = jwt.sign(
            { email: req.body.userCas.email, ...student },
            process.env.SECRET_TOKEN
          );

          res.status(200).send({ token });
        }
      }
    }
  } catch (err) {
    next(err);
  }
};
