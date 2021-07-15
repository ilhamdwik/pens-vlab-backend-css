"use strict";

import { users } from "@prisma/client";
import { Response, Request, NextFunction } from "express";

/**
 * Users API.
 * @route GET /api/v1/admin/user
 */
export const adminGetUsers = async (
  req: Request<{}, {}, {}, { page?: number }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await req.db.users.findMany({      
      include: {
        user_to_role: {
          include: {
            roles: true,
          },
        },
      },
      skip: req.query.page ? (req.query.page - 1) * 10 : undefined,
      take: req.query.page ? 10 : undefined,
      orderBy: {
        updatedAt: "asc",
      },
    });

    const count = await req.db.users.count();

    res.status(200).send({ data: users, count: count });
  } catch (e) {
    next(e);
  }
};

/**
 * Users API.
 * @route GET /api/v1/admin/user/detail/:id
 */
export const adminGetDetailUser = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await req.db.users.findFirst({
      where: { id: req.params.id },
    });

    res.status(200).send(user);
  } catch (e) {
    next(e);
  }
};

/**
 * Users API.
 * @route POST /api/v1/admin/user/create
 */
export const adminPostCreateUser = async (
  req: Request<{}, {}, users>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await req.db.users.create({
      data: req.body,
    });

    res.status(201).send(user);
  } catch (e) {
    next(e);
  }
};

/**
 * Users API.
 * @route PUT /api/v1/admin/user/update/:id
 */
export const adminPutUpdateUser = async (
  req: Request<{ id: string }, {}, users>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await req.db.users.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });

    res.status(200).send(user);
  } catch (e) {
    next(e);
  }
};

/**
 * Users API.
 * @route DELETE /api/v1/admin/user/delete/:id
 */
export const adminDeleteUser = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    await req.db.users.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).send("Data deleted");
  } catch (e) {
    next(e);
  }
};
