import { errorHandler } from "@/middlewares/error-handler-middleware";
import { ApplicationError } from "@/utils/user-protocols";
import { Request, Response } from "express";
import httpStatus from "http-status";
import { picksServices } from "@/services/picks-services";

async function getPicks(req: any, res: any) {
    try {
        const picks = await picksServices.getPicks();
        return res.status(httpStatus.OK).send({ picks });
    } catch (err) {
        const error = err as ApplicationError | Error
        errorHandler(error, req, res);
    }
}

export const picksControllers = {
    getPicks
}
