// import { Request, Response } from "express";
import httpStatus from "http-status";
import { ApplicationError } from "../utils/user-protocols";
import { errorHandler } from "../middlewares/error-handler-middleware";
import { userServices } from "../services/user-services";

export async function getUsers (req: any, res: any) {
    try {
        const users = await userServices.getUsers();
        return res.status(httpStatus.OK).send({ users })
    } catch (err: unknown) {
        const error = err as ApplicationError;
        errorHandler(error, req, res);
    }
}
