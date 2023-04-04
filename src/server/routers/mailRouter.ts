import { mailController } from "../controllers/mailController";
import { Router } from "express";

export const mailRouter = Router();
mailRouter.post("/", mailController.send);
