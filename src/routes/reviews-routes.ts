import { Router } from "express";
import { reviewsControllers } from "@/controllers/reviews-controllers";
import { authValidate } from "@/middlewares/auth-validation-middleware";

const reviewsRoutes = Router();

reviewsRoutes.get("/", reviewsControllers.getReviews);
reviewsRoutes.get("/:id", authValidate, reviewsControllers.getReviewsByUserId);
reviewsRoutes.post("/new", authValidate, reviewsControllers.newReview);
reviewsRoutes.delete("/:id", authValidate, reviewsControllers.deleteReview);
reviewsRoutes.put("/:id", authValidate, reviewsControllers.updateReview);

export default reviewsRoutes;
