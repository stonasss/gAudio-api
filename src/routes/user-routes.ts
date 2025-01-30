import { Router } from "express";
import { getUsers, register, getSpecificUser } from "@/controllers/user-controllers"

const userRoutes = Router();

userRoutes.post("/auth/create", register);
userRoutes.get("/auth", getUsers);
userRoutes.get("/auth/:id", getSpecificUser);

export default userRoutes;
