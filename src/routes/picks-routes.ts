import { Router } from "express";
import { picksControllers } from "../controllers/picks-controllers";
import { authValidate } from "@/middlewares/auth-validation-middleware";

const picksRoutes = Router();

picksRoutes.get("/", picksControllers.getPicks);
picksRoutes.post("/new", authValidate, picksControllers.newPick);

export default picksRoutes;
