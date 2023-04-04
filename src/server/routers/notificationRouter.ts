import { notificationController } from "../controllers/notificationController";
import { Router } from "express";

export const notificationRouter = Router();
notificationRouter.post("/subscribe", notificationController.subscribe);