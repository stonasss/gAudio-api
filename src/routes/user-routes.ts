import { Router } from "express";
import { getUsers } from "../controllers/user-controllers"

const userRoutes = Router();

userRoutes.get("/auth", getUsers);

export default userRoutes;
