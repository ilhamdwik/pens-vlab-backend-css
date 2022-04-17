"use strict";

import { Response, Request, NextFunction } from "express";

export const getAllForums = async (
    req: Request<{}, {}, {}>,
    res: Response,
    next: NextFunction
) => {
    try{
        const forum = await req.db.forums.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                students: {
                    select: {
                        name: true,
                    },
                },
                classes: {
                    select: {
                        kelas: true,
                    },
                },
            },
        });

        res.status(200).send(forum);
    } catch (err) {
        next(err);
    }
};

export const getForumsDetail = async (
    req: Request<{ id: string }, {}, {}>,
    res: Response,
    next: NextFunction
) => {
    try {
        const forum = await req.db.forums.findUnique({
            where: {
                id: req.params.id,
            },
            include: {
                students: {
                    select: {
                        name: true,
                    },
                },
                classes: {
                    select: {
                        kelas: true,
                    }
                }
            },
        });

        res.status(200).send(forum);
    } catch (err) {
        next(err);
    }
};

export const postCreateForums = async (
    req: Request<
        {}, 
        {}, 
        {
            author_id: string;
            class_id: string;
            question: string;
        }
    >,
    res: Response,
    next: NextFunction
) => {
    try {
        const forum = await req.db.forums.create({
            data: {
                author_id: req.body.author_id,
                class_id: req.body.class_id,
                question: req.body.question,
            },
        });

        res.status(201).send(forum);
    } catch (err) {
        next(err);
    }
};

export const deleteForums = async (
    req: Request<{ id: string }, {}, {}>,
    res: Response,
    next: NextFunction
) => {
    try {
        await req.db.comments.deleteMany({
            where: {
                forum_id: req.params.id,
            }
        });

        await req.db.forums.delete({
            where: {
                id: req.params.id,
            },
        });

        res.status(200).send("Data deleted");
    } catch (err) {
        next(err);
    }
}