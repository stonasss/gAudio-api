import { reviewsControllers } from "@/controllers/reviews-controllers";
import { Router } from "express";

const reviewsRoutes = Router();

reviewsRoutes.get("/", reviewsControllers.getReviews);

export default reviewsRoutes;
