import { appointmentController } from "../controllers/appointmentController";
import { Router } from "express";
import { isAuthenticated } from "../middleware/auth";
import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

export const appointmentRouter = Router();

appointmentRouter.post(
  "/",
  isAuthenticated,
  appointmentController.createAppointment
);
appointmentRouter.get(
  "/",
  isAuthenticated,
  appointmentController.getAppointments
);
appointmentRouter.get(
  "/:id",
  isAuthenticated,
  appointmentController.getAppointment
);
appointmentRouter.put(
  "/:id",
  isAuthenticated,
  appointmentController.updateAppointment
);
appointmentRouter.delete(
  "/:id",
  isAuthenticated,
  appointmentController.deleteAppointment
);
