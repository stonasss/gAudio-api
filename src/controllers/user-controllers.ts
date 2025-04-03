import { Request, Response } from "express";
import httpStatus from "http-status";
import { ApplicationError, LoginUser, User } from "@/utils/user-protocols";
import { errorHandler } from "@/middlewares/error-handler-middleware";
import { userServices } from "@/services/user-services";
import { loginSchema, registerSchema } from "@/schemas/user-schemas";
import { userRepositories } from "@/repositories/user-repositories";

export async function getUsers (req: Request, res: Response) {
    try {
        const users = await userServices.getUsers();
        return res.status(httpStatus.OK).send({ users })
    } catch (err: unknown) {
        const error = err as ApplicationError;
        errorHandler(error, req, res);
    }
}

export async function getSpecificUser(req: Request, res: Response) {
    const { id } = req.params;

    try {
        const user = await userServices.getSpecificUser(parseInt(id));
        return res.status(httpStatus.OK).send({ user });
    } catch (err) {
        const error = err as ApplicationError | Error;
        errorHandler(error, req, res)
    }
}

export async function register (req: Request, res: Response) {
    const {username, email, password} : User = req.body;
    const { error } = registerSchema.validate(req.body)

    if (error) return res.status(httpStatus.BAD_REQUEST).send({ message: error.message })

    try {
        await userServices.createUser({ username, email, password });
        res.status(httpStatus.CREATED).send({ username, email })
    } catch (err: unknown) {
        const error = err as ApplicationError;
        errorHandler(error, req, res);
    }
}

async function login (req: Request, res: Response) {
    const login = req.body as LoginUser;
    const { error } = loginSchema.validate(login);
    if (error) return res.status(httpStatus.BAD_REQUEST).send({ message: error.message });

    const { email, password } = req.body;

    try {
        const token = await userServices.loginUser({ email, password });
        if (token) {
            const username = await userRepositories.findUserByEmail(email);
            return res.status(httpStatus.OK).send({ token, username })
        }
    } catch (err) {
        const error = err as ApplicationError | Error;
        errorHandler(error, req, res);
    }
}

export async function updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const userId = parseInt(id);
    const { username, email, password } = req.body;

    const { error } = registerSchema.validate(req.body)
    if (error) return res.status(httpStatus.BAD_REQUEST).send({ message: error.message });

    const userToken = res.locals.user;
    try {
        const user = await userServices.retrieveUserById(id);
        if (!user) return res.status(httpStatus.BAD_REQUEST).send("User not found");

        const user_id = await userServices.retrieveSession(userToken);
        if (user.id !== user_id.user_id) return res.status(httpStatus.UNAUTHORIZED).send("Invalid request");

        const result = await userServices.updateUser({ username, email, password, userId })
        return res.status(httpStatus.OK).send({ result });
    } catch (err) {
        console.log(err)
        const error = err as ApplicationError | Error;
        errorHandler(error, req, res);
    }
}

export async function deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    const userId = parseInt(id);

    const userToken = res.locals.user;
    try {
        const user = await userServices.retrieveUserById(id);
        if (!user) return res.status(httpStatus.BAD_REQUEST).send("User not found");

        const user_id = await userServices.retrieveSession(userToken);
        if (user.id !== user_id.user_id) return res.status(httpStatus.UNAUTHORIZED).send("Invalid request");

        await userServices.deleteUser({ userId })
        return res.status(httpStatus.NO_CONTENT).send({});
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
