import { reviewsServices } from "@/services/reviews-services";
import httpStatus from "http-status";
import { errorHandler } from "@/middlewares/error-handler-middleware";
import { ApplicationError } from "@/utils/user-protocols";
import { Request, Response } from "express";
import { CheckId } from "@/utils/protocols";
import { userServices } from "@/services/user-services";
import { NewReview } from "@/utils/reviews-protocols";
import { reviewSchema, updateReviewSchema } from "@/schemas/reviews-schemas";
import { picksServices } from "@/services/picks-services";

async function getReviews(req: Request, res: Response) {
    try {
        const reviews = await reviewsServices.getReviews()
        return res.status(httpStatus.OK).send({ reviews });
    } catch (err) {
        const error = err as ApplicationError | Error
        errorHandler(error, req, res);
    }
}

async function getReviewsByUserId(req: Request, res: Response) {
    const { id } = req.params as CheckId;
    const userToken = res.locals.user;

    try {
        const sessionId = await userServices.retrieveSession(userToken);
        const userId = await userServices.retrieveUserById(id);
        if (userId.id !== sessionId.userId) return res.status(httpStatus.UNAUTHORIZED).send("Invalid request");

        const userReviews = await reviewsServices.getReviewsByUserId(id);
        return res.status(httpStatus.OK).send({ userReviews });
    } catch (err) {
        const error = err as ApplicationError | Error;
        errorHandler(error, req, res);
    }
}

async function newReview(req: Request, res: Response) {
    const review = req.body as NewReview;
    const userToken = res.locals.user;

    const { error } = reviewSchema.validate(review);
    if (error) return res.status(httpStatus.BAD_REQUEST).send({ message: error.message })
    const { description, relisten, pickId } = req.body;

    try {
        const userId = userServices.retrieveSession(userToken);
        if (!userId) return res.status(httpStatus.UNAUTHORIZED);

        const pickExists = await picksServices.getPickById(pickId);
        if (!pickExists) return res.status(httpStatus.BAD_REQUEST).send("Pick does not exist");

        const result = await reviewsServices.createReview({
            description,
            relisten,
            pickId: pickExists.id,
            userId: (await userId).userId
        })

        return res.status(httpStatus.CREATED).send({ result });
    } catch (err) {
        const error = err as ApplicationError | Error;
        errorHandler(error, req, res);
    }
}

async function deleteReview(req: Request, res: Response) {
    const { id } = req.params as CheckId;
    const userToken = res.locals.user;

    try {
        const reviewExists = await reviewsServices.getReviewById(id);
        if (!reviewExists) return res.status(httpStatus.BAD_REQUEST).send("Review does not exists");

        const userId = await userServices.retrieveSession(userToken);
        if (reviewExists.userId !== userId.userId) return res.status(httpStatus.UNAUTHORIZED).send("Invalid request");

        await reviewsServices.deleteReview(id);
        return res.status(httpStatus.OK).send("Review deleted");
    } catch (err) {
        const error = err as ApplicationError | Error;
        errorHandler(error, req, res);
    }
}

async function updateReview(req: Request, res: Response) {
    const { id } = req.params as CheckId;
    const userToken = res.locals.user;
    const review = req.body as NewReview;

    const { error } = updateReviewSchema.validate(review)
    if (error) return res.status(httpStatus.BAD_REQUEST).send({ message: error.message });

    const { description, relisten } = req.body;

    try {
        const reviewExists = await reviewsServices.getReviewById(id);
        if (!reviewExists) return res.status(httpStatus.BAD_REQUEST).send("Review does not exist");

        const userId = await userServices.retrieveSession(userToken);
        if (reviewExists.userId !== userId.userId) return res.status(httpStatus.UNAUTHORIZED).send("Invaid request");

        const result = await reviewsServices.updateReview({
            description,
            relisten,
            id
        });
        return res.status(httpStatus.OK).send({ result });
    } catch (err) {
        const error = err as ApplicationError | Error;
        errorHandler(error, req, res);
    }
}

export const reviewsControllers = {
    getReviews,
    getReviewsByUserId,
    newReview,
    deleteReview,
    updateReview
}
