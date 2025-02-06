import { errorHandler } from "@/middlewares/error-handler-middleware";
import { ApplicationError } from "@/utils/user-protocols";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { picksServices } from "@/services/picks-services";
import { NewPick } from "@/utils/picks-protocols";
import { pickSchema } from "@/schemas/picks-schemas";
import { userServices } from "@/services/user-services";
import { CheckId } from "@/utils/protocols";

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

async function getPicksByUserId(req: Request, res: Response) {
    const { id } = req.params as CheckId;
    const userToken = res.locals.user;

    try {
        const sessionId = await userServices.retrieveSession(userToken);
        const userId = await userServices.retrieveUserById(id);
        if (userId.id !== sessionId) return res.status(httpStatus.UNAUTHORIZED).send("Invalid request");

        const userPicks = await picksServices.getPicksByUserId(id);
        return res.status(httpStatus.OK).send({ userPicks });
    } catch (err) {
        const error = err as ApplicationError | Error;
        errorHandler(error, req, res);
    }
}

async function deletePick(req: Request, res: Response) {
    const { id } = req.params as CheckId;
    const userToken = res.locals.user;

    try {
        const pickExists = await picksServices.getPickById(id);
        if (!pickExists) return res.status(httpStatus.BAD_REQUEST).send("Pick does not exist");

        const userId = await userServices.retrieveSession(userToken);
        if (pickExists.userId !== userId) return res.status(httpStatus.UNAUTHORIZED).send("Invalid request")
        
        await picksServices.deletePick(id);
        return res.status(httpStatus.OK).send("Pick deleted");
    } catch (err) {
        const error = err as ApplicationError | Error;
        errorHandler(error, req, res);
    }
}

async function updatePick(req: Request, res: Response) {
    const { id } = req.params as CheckId;
    const userToken = res.locals.user;
    const pick = req.body as NewPick;

    const { error } = pickSchema.validate(pick);
    if (error) return res.status(httpStatus.BAD_REQUEST).send({ message: error.message });

    const { image, artist, title, description, link } = req.body;

    try {
        const pickExists = await picksServices.getPickById(id);
        if (!pickExists) return res.status(httpStatus.BAD_REQUEST).send("Pick does not exist");

        const userId = await userServices.retrieveSession(userToken);
        if (pickExists.userId !== userId) return res.status(httpStatus.UNAUTHORIZED).send("Invalid request");

        const result = await picksServices.updatePick({
            image,
            artist,
            title,
            description,
            link,
            id
        });
        return res.status(httpStatus.OK).send({ result });
    } catch (err) {
        const error = err as ApplicationError | Error;
        errorHandler(error, req, res);
    }
}

export const picksControllers = {
    getPicks,
    newPick,
    deletePick,
    getPicksByUserId,
    updatePick
}
