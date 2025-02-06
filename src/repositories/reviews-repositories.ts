import prisma from "../config/database";

async function getReviews() {
    return prisma.reviews.findMany();
};

export const reviewsRepositories = {
    getReviews,
}
