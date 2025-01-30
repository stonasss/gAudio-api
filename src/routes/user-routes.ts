import { Router } from "express";
import { getUsers, register, getSpecificUser, updateUser, deleteUser } from "@/controllers/user-controllers"
/* import { validateSchema } from "@/middlewares/auth-validation-middleware";
import { registerSchema } from "@/schemas/user-schemas"; */

const userRoutes = Router();

userRoutes.post("/auth/create", register);
userRoutes.get("/auth", getUsers);
userRoutes.get("/auth/:id", getSpecificUser);
userRoutes.put("/auth/:id", updateUser);
userRoutes.delete("/auth/:id", deleteUser);

export default userRoutes;
