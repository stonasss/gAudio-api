import { Router } from "express";
import { userControllers } from "@/controllers/user-controllers"
import { authValidate } from "@/middlewares/auth-validation-middleware";

const userRoutes = Router();

userRoutes.post("/register", userControllers.register);
userRoutes.post("/login", userControllers.login)
userRoutes.get("/users", userControllers.getUsers);
userRoutes.get("/users/:id", userControllers.getSpecificUser);
userRoutes.put("/users/:id", authValidate,userControllers.updateUser);
userRoutes.delete("/users/:id", authValidate, userControllers.deleteUser);

export default userRoutes;
