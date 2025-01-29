import { Router } from "express";
import { getUsers, register } from "@/controllers/user-controllers"

const userRoutes = Router();

userRoutes.post("/auth/create", register);
userRoutes.get("/auth", getUsers);

export default userRoutes;
