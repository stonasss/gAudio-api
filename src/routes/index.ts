import { Router } from "express";
import userRoutes from "./user-routes";
import picksRoutes from "./picks-routes";
import reviewsRoutes from "./reviews-routes";

const router = Router();

router
    .use("/", userRoutes)
    .use("/picks", picksRoutes)
    .use("/reviews", reviewsRoutes)

export default router;
