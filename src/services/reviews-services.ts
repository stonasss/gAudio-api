import { errors } from "@/errors";
import { reviewsRepositories } from "@/repositories/reviews-repositories";
import { ReviewToUpdate } from "@/utils/reviews-protocols";
/* import { ValidReview } from "@/utils/reviews-protocols";   FIX LATER */

async function getReviews() {
    const result = await reviewsRepositories.getReviews();
    return result;
}

async function getReviewById(id: string) {
    const reviewId = parseInt(id);
    const review = await reviewsRepositories.getReviewById(reviewId);
    if (!review) throw errors.notFoundError();
    return review;
}

async function getReviewsByUserId(id: string) {
    const userId = parseInt(id);
    const userReviews = await reviewsRepositories.getReviewsByUser(userId);
    return userReviews;
}

async function createReview({ description, relisten, pickId, userId }: any) {
    const review = await reviewsRepositories.createReview({
        description,
        relisten,
        pickId,
        userId
    });

    return review;
}

async function deleteReview(id: string) {
    const reviewId = parseInt(id);
    const review = await reviewsRepositories.getReviewById(reviewId);
    if (!review) throw errors.notFoundError();
    const result = await reviewsRepositories.deleteReview(reviewId);
    return result;
}

async function updateReview({ description, relisten, id }: ReviewToUpdate) {
    const reviewId = parseInt(id);
    const review = await reviewsRepositories.updateReview({
        description,
        relisten,
        reviewId
    });
    return review;
}

export const reviewsServices = {
    getReviews,
    getReviewById,
    getReviewsByUserId,
    createReview,
    deleteReview,
    updateReview,
}
