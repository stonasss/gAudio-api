import { errors } from "@/errors";
import { reviewsRepositories } from "../repositories/reviews-repositories";

async function getReviews() {
    const result = await reviewsRepositories.getReviews();
    return result;
}

export const reviewsServices = {
    getReviews,
}
