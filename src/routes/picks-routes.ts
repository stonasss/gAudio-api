import { Router } from "express";
import { picksControllers } from "../controllers/picks-controllers";
import { authValidate } from "@/middlewares/auth-validation-middleware";

const picksRoutes = Router();

picksRoutes.get("/", picksControllers.getPicks);
picksRoutes.post("/new", authValidate, picksControllers.newPick);
picksRoutes.delete("/:id", authValidate, picksControllers.deletePick);

export default picksRoutes;
