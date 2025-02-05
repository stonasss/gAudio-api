import { Router } from "express";
import { userControllers } from "@/controllers/user-controllers"
/* import { validateSchema } from "@/middlewares/auth-validation-middleware";
import { registerSchema } from "@/schemas/user-schemas"; */

const userRoutes = Router();

userRoutes.post("/register", userControllers.register);
userRoutes.post("/login", userControllers.login)
userRoutes.get("/users", userControllers.getUsers);
userRoutes.get("/users/:id", userControllers.getSpecificUser);
userRoutes.put("/users/:id", userControllers.updateUser);
userRoutes.delete("/users/:id", userControllers.deleteUser);

export default userRoutes;
