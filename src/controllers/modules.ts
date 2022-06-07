"use strict";

import { modules } from "@prisma/client";
import { Response, Request, NextFunction } from "express";

/**
 * Modules API.
 * @route GET /api/v1/admin/modules
 */
export const adminGetModules = async (
  req: Request<{}, {}, {}, { page?: number }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const modules = await req.db.modules.findMany({
      include: {
        prog_languages: true,
      },
      skip: req.query.page ? (req.query.page - 1) * 10 : undefined,
      take: req.query.page ? 10 : undefined,
      orderBy: {
        updatedAt: "asc",
      },
    });

    const count = await req.db.modules.count();

    res.status(200).send({ data: modules, count: count });
  } catch (e) {
    next(e);
  }
};

/**
 * Modules API.
 * @route GET /api/v1/admin/modules/detail/:id
 */
export const adminGetDetailModule = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    const module = await req.db.modules.findFirst({
      where: { id: req.params.id },
      include: {
        submodules: true,
      },
    });

    res.status(200).send(module);
  } catch (e) {
    next(e);
  }
};

/**
 * Modules API.
 * @route POST /api/v1/admin/modules/create
 */
export const adminPostCreateModule = async (
  req: Request<{}, {}, modules>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { order, overview, prog_languages_id, title } = req.body;
    const module = await req.db.modules.create({
      data: {
        order,
        overview,
        title,
        prog_languages_id,
      },
    });

    res.status(201).send(module);
  } catch (e) {
    next(e);
  }
};

/**
 * Modules API.
 * @route PUT /api/v1/admin/modules/update/:id
 */
export const adminPutUpdateModule = async (
  req: Request<{ id: string }, {}, modules>,
  res: Response,
  next: NextFunction
) => {
  try {
    const module = await req.db.modules.update({
      where: {
        id: req.params.id,
      },
      data: {
        order: req.body.order,
        overview: req.body.overview,
        title: req.body.title,
        prog_languages_id: req.body.prog_languages_id,
      },
    });

    res.status(200).send(module);
  } catch (e) {
    next(e);
  }
};

/**
 * Modules API.
 * @route DELETE /api/v1/admin/modules/delete/:id
 */
export const adminDeleteModule = async (
  req: Request<{ id: string }, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    await req.db.submodules.findMany({
      where: {
        module_id: req.params.id,
      },
    });

    await req.db.submodules.deleteMany({
      where: {
        module_id: req.params.id,
      },
    });

    await req.db.modules.delete({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).send("Data deleted");
  } catch (e) {
    next(e);
  }
};
