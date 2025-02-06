import { Router } from "express";
import userRoutes from "./user-routes";
import picksRoutes from "./picks-routes";

const router = Router();

router
    .use("/", userRoutes)
    .use("/picks", picksRoutes)

export default router;