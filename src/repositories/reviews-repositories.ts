import prisma from "@/config/database";
import { EditReview, ValidReview } from "@/utils/reviews-protocols";

async function getReviews() {
    return prisma.reviews.findMany();
}

async function getReviewById(reviewId: number) {
    const review = await prisma.reviews.findFirst({
        where: {
            id: reviewId,
        },
    });

    return review;
}

async function getReviewsByUser(user_id: number) {
    const reviews = await prisma.reviews.findMany({
        where: {
            user_id,
        },
    });

    return reviews;
}

async function createReview({ description, relisten, pick_id, user_id }: ValidReview) {
    const review = await prisma.reviews.create({
        data: {
            description,
            relisten,
            pick_id,
            user_id
        },
    });

    return review;
}

async function deleteReview(reviewId: number) {
    const result = await prisma.reviews.delete({
        where: {
            id: reviewId,
        },
    });

    return result;
}

async function updateReview({ description, relisten, reviewId }: EditReview) {
    const result = await prisma.reviews.update({
        where: {
            id: reviewId,
        },
        data: {
            description,
            relisten
        },
    });

    return result;
}

export const reviewsRepositories = {
    getReviews,
    getReviewById,
    getReviewsByUser,
    createReview,
    deleteReview,
    updateReview,
}
