import { notificationController } from "../controllers/mailController";
import { Router } from "express";

export const notificationRouter = Router();
notificationRouter.post("/subscribe", notificationController.subscribe);