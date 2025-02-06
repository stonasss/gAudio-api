import { errorHandler } from "@/middlewares/error-handler-middleware";
import { ApplicationError } from "@/utils/user-protocols";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { picksServices } from "@/services/picks-services";
import { NewPick } from "@/utils/picks-protocols";
import { pickSchema } from "@/schemas/picks-schemas";
import { userServices } from "@/services/user-services";

async function getPicks(req: Request, res: Response) {
    try {
        const picks = await picksServices.getPicks();
        return res.status(httpStatus.OK).send({ picks });
    } catch (err) {
        const error = err as ApplicationError | Error
        errorHandler(error, req, res);
    }
}

async function newPick(req: Request, res: Response) {
    const pick = req.body as NewPick;
    const userToken = res.locals.user;

    const { error } = pickSchema.validate(pick);
    if (error) return res.status(httpStatus.BAD_REQUEST).send({ message: error.message });

    const { image, title, artist, description, link } = req.body;

    try {
        const userId = await userServices.retrieveSession(userToken);
        if (!userId) return res.status(httpStatus.UNAUTHORIZED);

        const result = await picksServices.createPick({
            image,
            title,
            artist,
            description,
            link,
            userId
        });
        
        return res.status(httpStatus.CREATED).send({ result });
    } catch (err) {
        const error = err as ApplicationError | Error;
        errorHandler(error, req, res);
    }
}

export const picksControllers = {
    getPicks,
    newPick,
}
