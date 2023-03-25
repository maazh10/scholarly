import { userController } from "../controllers/userController";
import { Router } from "express";
import { isAuthenticated } from "../middleware/auth";

export const userRouter = Router();

userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/logout", userController.logout);
userRouter.get("/me", isAuthenticated, userController.getUser);
userRouter.get("/students", isAuthenticated, userController.getStudents);
userRouter.get("/tutors", isAuthenticated, userController.getTutors);
userRouter.get("/", isAuthenticated, userController.getUsers);
