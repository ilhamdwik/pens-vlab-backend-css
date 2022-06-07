"use strict";

import { Response, Request, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

type cookieData = {
  nomor: number;
  nipnrp: string;
  nama: string;
  hakAkses: ("dosen" | "mahasiswa")[];
  iat: number;
};

type userDetail = {
  id: number;
  nip?: string;
  nrp?: string;
  name: string;
  kelas?: string;
  program?: string;
  jurusan: string;
  class_id?: string;
  role: "dosen" | "mahasiswa";
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
    const admin = await req.db.admins.findUnique({
      where: {
        email: req.body.email,
      },
    });

    if (!admin) {
      throw "User not found";
    }

    const login = await bcrypt.compare(req.body.pswd, admin.pswd);

    if (!login) {
      throw "Unauthorized";
    }

    const token = jwt.sign(
      {
        user_id: admin.id,
        email: admin.email,
        name: admin.name,
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
      userDetail: userDetail;
    }
  >,
  res: Response,
  next: NextFunction
) => {
  try {
    //on production change this to jwt.verify using ETHOL secret token
    
    // jwt verify invalid signature
    // const userCookie = (
    //   process.env.ETHOL_SECRET_TOKEN
    //   ? jwt.verify(req.body.token, process.env.ETHOL_SECRET_TOKEN, (err)=>{
    //     if (err) return res.sendStatus(403)
    //   })
    //   : jwt.decode(req.body.token as string)
    // ) as cookieData;
    // console.log("tes error = ",userCookie)

    const userCookie = (
      jwt.decode(req.body.token as string)
    ) as cookieData;

    const student = await req.db.students.findUnique({
      where: { nrp: userCookie.nipnrp },
    });

    const lecturer = await req.db.lecturers.findUnique({
      where: { nip: userCookie.nipnrp },
    });

    if (student || lecturer) {
      if (lecturer) {
        const token = jwt.sign(lecturer, process.env.SECRET_TOKEN);

        res.status(200).send({ token });
      } 
      else if (student) {
        const token = jwt.sign(student, process.env.SECRET_TOKEN);

        res.status(200).send({ token });
      }
    } 
    // else {
    //   if (req.body.userDetail.nip && req.body.userDetail.role === "dosen") {
    //     const lecturer = await req.db.lecturers.create({
    //       data: {
    //         name: req.body.userDetail.name,
    //         nip: req.body.userDetail.nip,
    //         position: "dosen",
    //         class_id: req.body.userDetail.class_id ?? "",
    //       },
    //     });
    //     const token = jwt.sign(lecturer, process.env.SECRET_TOKEN);

    //     res.status(200).send({ token });
    //   } 
    //   else if (
    //     req.body.userDetail.nrp &&
    //     req.body.userDetail.role === "mahasiswa"
    //   ) {
    //     const userClass = await req.db.classes.findFirst({
    //       where: {
    //         kelas: req.body.userDetail.kelas.toString(),
    //         program: req.body.userDetail.program,
    //         jurusan: req.body.userDetail.jurusan,
    //       },
    //     });

    //     if (userClass) {
    //       const student = await req.db.students.create({
    //         data: {
    //           name: req.body.userDetail.name,
    //           nrp: req.body.userDetail.nrp,
    //           class_id: userClass.id,
    //         },
    //       });

    //       const token = jwt.sign(student, process.env.SECRET_TOKEN);

    //       res.status(200).send({ token });
    //     } else {
    //       const newUserClass = await req.db.classes.create({
    //         data: {
    //           jurusan: req.body.userDetail.jurusan,
    //           kelas: req.body.userDetail.kelas.toString(),
    //           program: req.body.userDetail.program,
    //         },
    //       });

    //       const student = await req.db.students.create({
    //         data: {
    //           name: req.body.userDetail.name,
    //           nrp: req.body.userDetail.nrp,
    //           class_id: newUserClass.id,
    //         },
    //       });

    //       const token = jwt.sign(student, process.env.SECRET_TOKEN);

    //       res.status(200).send({ token });
    //     }
    //   }
    // }
  } catch (err) {
    next(err);
  }
};
