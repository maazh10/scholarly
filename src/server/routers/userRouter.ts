import { userController } from "../controllers/userController";
import { Router } from "express";

export const userRouter = Router();

userRouter.get("/", userController.getAllUsers);

userRouter.post("/", userController.createUser);
