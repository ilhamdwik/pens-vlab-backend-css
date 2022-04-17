"use strict";

import { Response, Request, NextFunction } from "express";

export const getComments = async (
    req: Request<{}, {}, {  }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const comment = await req.db.comments.findMany({
            orderBy: {
                createdAt: "desc",
            },
            include: {
                students: {
                    select: {
                        name: true
                    },
                },
                classes: {
                    select: {
                        kelas: true
                    }
                }
            },
        });

        res.status(200).send(comment);
    } catch (err) {
        next(err);
    }
};

export const postCreateComments = async (
    req: Request<
        {}, 
        {}, 
        {
            student_id: string;
            class_id: string;
            forum_id: string;
            answer: string;
        }
    >,
    res: Response,
    next: NextFunction
) => {
    try {
        const comment = await req.db.comments.create({
            data: {
                student_id: req.body.student_id,
                class_id: req.body.class_id,
                forum_id: req.body.forum_id,
                answer: req.body.answer,
            },
        });

        res.status(201).send(comment);
    } catch (err) {
        next(err);
    }
};

export const deleteComments = async (
    req: Request<{ id: string }, {}, {}>,
    res: Response,
    next: NextFunction
) => {
    try {
        await req.db.comments.delete({
           where: {
               id: req.params.id,
           },
        });

        res.status(200).send("Data deleted");
    } catch (err) {
        next(err);
    }
}