import { Router } from "express";
import { picksControllers } from "../controllers/picks-controllers";

const picksRoutes = Router();

picksRoutes.get("/", picksControllers.getPicks);

export default picksRoutes;
