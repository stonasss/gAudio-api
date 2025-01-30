import { Router } from "express";
import { userControllers } from "@/controllers/user-controllers"
/* import { validateSchema } from "@/middlewares/auth-validation-middleware";
import { registerSchema } from "@/schemas/user-schemas"; */

const userRoutes = Router();

userRoutes.post("/register", userControllers.register);
userRoutes.post("/login", userControllers.login)
userRoutes.get("/auth", userControllers.getUsers);
userRoutes.get("/auth/:id", userControllers.getSpecificUser);
userRoutes.put("/auth/:id", userControllers.updateUser);
userRoutes.delete("/auth/:id", userControllers.deleteUser);

export default userRoutes;
