import httpStatus from "http-status";
import { Request, Response } from "express";
import { ApplicationError } from "../utils/user-protocols";

export function errorHandler(
    err: ApplicationError | Error,
    req: Request,
    res: Response
) {
    if (err.name === "ConflictError" || err.name === "DuplicatedEmailError" || err.name === "DuplicatedUsernameError") {
        return res.status(httpStatus.CONFLICT).send({
            message: err.message,
        });
    }

    if (err.name === "NotFoundError") {
        return res.status(httpStatus.NOT_FOUND).send({
            message: err.message,
        })
    }

    if (err.name === "InvalidCredentialsError") {
        return res.status(httpStatus.UNAUTHORIZED).send({
            message: "Invalid credentials!",
        });
    }

    console.error(err);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
        error: "InternalServerError",
        message: "Internal Server Error",
    });
}
