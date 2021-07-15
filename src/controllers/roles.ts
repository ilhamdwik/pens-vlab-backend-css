"use strict";

import { roles } from "@prisma/client";
import { Response, Request, NextFunction } from "express";

/**
 * Roles API.
 * @route GET /api/v1/admin/roles
 */
export const adminGetRoles = async (
  req: Request<{}, {}, {}, { page?: number }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const roles = await req.db.roles.findMany({
      skip: req.query.page ? (req.query.page - 1) * 10 : undefined,
      take: req.query.page ? 10 : undefined,
      orderBy: {
        updatedAt: "asc",
      },
    });

    const count = await req.db.roles.count();

    res.status(200).send({ data: roles, count: count });
  } catch (e) {
    next(e);
  }
};

/**
 * Roles API.
 * @route GET /api/v1/admin/roles/detail/:id
 */
export const adminGetDetailRole = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const role = await req.db.roles.findFirst({
      where: { id: req.params.id },
    });

    res.status(200).send(role);
  } catch (e) {
    next(e);
  }
};

/**
 * Roles API.
 * @route POST /api/v1/admin/roles/create
 */
export const adminPostCreateRole = async (
  req: Request<{}, {}, roles>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, role_name } = req.body;
    const role = await req.db.roles.create({
      data: {
        role_name,
        id,
      },
    });

    res.status(201).send(role);
  } catch (e) {
    next(e);
  }
};

/**
 * Roles API.
 * @route PUT /api/v1/admin/roles/update/:id
 */
export const adminPutUpdateRole = async (
  req: Request<{ id: string }, {}, roles>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, role_name } = req.body;
    const role = await req.db.roles.update({
      where: {
        id: req.params.id,
      },
      data: {
        id,
        role_name,
      },
    });

    res.status(200).send(role);
  } catch (e) {
    next(e);
  }
};

/**
 * Roles API.
 * @route DELETE /api/v1/admin/roles/delete/:id
 */
export const adminDeleteRole = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    await req.db.roles.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).send("Data deleted");
  } catch (e) {
    next(e);
  }
};
