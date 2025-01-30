import { Request, Response } from "express";
import httpStatus from "http-status";
import { ApplicationError, User } from "@/utils/user-protocols";
import { errorHandler } from "@/middlewares/error-handler-middleware";
import { userServices } from "@/services/user-services";
import { registerSchema } from "@/schemas/user-schemas";

export async function getUsers (req: any, res: any) {
    try {
        const users = await userServices.getUsers();
        return res.status(httpStatus.OK).send({ users })
    } catch (err: unknown) {
        const error = err as ApplicationError;
        errorHandler(error, req, res);
    }
}

export async function register (req: Request, res: Response) {
    const {username, email, password} : User = req.body;
    const { error } = registerSchema.validate(req.body)

    try {
        await userServices.createUser({ username, email, password });
        res.status(httpStatus.CREATED).send({})
    } catch (err: unknown) {
        const error = err as ApplicationError;
        errorHandler(error, req, res);
    }
}

export async function getSpecificUser(req: any, res: any) {
    const { id } = req.params;

    try {
        const user = await userServices.getSpecificUser(parseInt(id));
        return res.status(httpStatus.OK).send({ user });
    } catch (err) {
        const error = err as ApplicationError | Error;
        errorHandler(error, req, res)
    }
}
