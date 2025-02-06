import { Request, Response } from "express";
import httpStatus from "http-status";
import { errorHandler } from "@/middlewares/error-handler-middleware";
import { ApplicationError } from "@/utils/user-protocols";
import { reviewsServices } from "@/services/reviews-services";

async function getReviews(req: Request, res: Response) {
    try {
        const reviews = await reviewsServices.getReviews();
        return res.status(httpStatus.OK).send({ reviews });
    } catch (err) {
        const error = err as ApplicationError | Error;
        errorHandler(error, req, res);
    }
}

export const reviewsControllers = {
    getReviews,
}
