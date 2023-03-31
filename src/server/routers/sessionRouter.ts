import { sessionController } from "../controllers/sessionController";
import { Router } from "express";
import { isAuthenticated } from "../middleware/auth";

export const sessionRouter = Router();

sessionRouter.post("/", isAuthenticated, sessionController.createSession);
sessionRouter.get("/", isAuthenticated, sessionController.getSession);
sessionRouter.delete("/", isAuthenticated, sessionController.deleteSession);