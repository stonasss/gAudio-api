import { Request, Response } from "express";
import httpStatus from "http-status";
import { ApplicationError, LoginUser, User } from "@/utils/user-protocols";
import { errorHandler } from "@/middlewares/error-handler-middleware";
import { userServices } from "@/services/user-services";
import { loginSchema, registerSchema } from "@/schemas/user-schemas";
import { userRepositories } from "@/repositories/user-repositories";

export async function getUsers (req: any, res: any) {
    try {
        const users = await userServices.getUsers();
        return res.status(httpStatus.OK).send({ users })
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

export async function register (req: any, res: any) {
    const {username, email, password} : User = req.body;
    const { error } = registerSchema.validate(req.body)

    if (error) return res.status(httpStatus.BAD_REQUEST).send({ message: error.message })

    try {
        await userServices.createUser({ username, email, password });
        res.status(httpStatus.CREATED).send({})
    } catch (err: unknown) {
        const error = err as ApplicationError;
        errorHandler(error, req, res);
    }
}

async function login (req: any, res: any) {
    const login = req.body as LoginUser;
    const { error } = loginSchema.validate(login);

    if (error) return res.status(httpStatus.BAD_REQUEST).send({ message: error.message });

    const { email, password } = req.body;
    try {
        const token = await userServices.loginUser({ email, password });
        if (token) {
            const username = await userRepositories.findUserByEmail(email);
            return res.status(httpStatus.OK).send({ token, username})
        }
    } catch (err) {
        const error = err as ApplicationError | Error;
        errorHandler(error, req, res);
    }
}

export async function updateUser(req: any, res: any) {
    const { id } = req.params;
    const userId = parseInt(id);
    const { username, email, password } = req.body;

    try {
        const result = await userServices.updateUser({ username, email, password, userId })
        return res.status(httpStatus.OK).send({ result });
    } catch (err) {
        const error = err as ApplicationError | Error;
        errorHandler(error, req, res);
    }
}

export async function deleteUser(req: any, res: any) {
    const { id } = req.params;
    const userId = parseInt(id);

    try {
        await userServices.deleteUser({ userId })
        return res.status(httpStatus.OK).send({});
    } catch (err) {
        const error = err as ApplicationError | Error;
        errorHandler(error, req, res)
    }
}

export const userControllers = {
    getUsers,
    getSpecificUser,
    register,
    login,
    updateUser,
    deleteUser
}
