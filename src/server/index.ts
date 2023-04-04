import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
import { sequelize } from "./datasource";
import webpush from "web-push";

import session from 'express-session';
import cors from "cors"

import { userRouter } from "./routers/userRouter";
import { appointmentRouter } from "./routers/appointmentRouter";
import { sessionRouter } from "./routers/sessionRouter";
import { mailRouter } from "./routers/mailRouter";

export const app = express();
app.use(bodyParser.json());

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

(async () => {
  await sequelize.sync({ alter: { drop: false } });
  console.log("Connected to database!");
})();

app.use(session({
  secret: 'test',
  resave: false,
  saveUninitialized: true
}));

app.use("/api/users", userRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/mail", mailRouter);

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_SENDTO}`,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Subscribe route to test rn
// TODO: Move to own file
// TODO: Setup service worker
// TODO: Setup push notifications from client side, i.e. ask for permission
app.post("/api/subscribe", (req, res) => {
  const subscription = req.body;
  res.status(201).json({});
  const payload = JSON.stringify({ title: "Push Test" });
  webpush.sendNotification(subscription, payload).catch((err) => console.error(err));
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
