import express from "express";
import bodyParser from "body-parser";
import webpush from "web-push";
import dotenv from "dotenv";
dotenv.config();
import { sequelize } from "./datasource";
import session from 'express-session';
import cors from "cors"
import { userRouter } from "./routers/userRouter";
import { appointmentRouter } from "./routers/appointmentRouter";
import { sessionRouter } from "./routers/sessionRouter";
import { mailRouter } from "./routers/mailRouter";
import { notificationRouter } from "./routers/notificationRouter";

const publicVapidKey = 'BDa1ktPguoTlQ7TfVc0qqcsGb_GUJ8vXVaq_xOomHqz9zWnptKN0wSA0-lNOpQT53FHygXBXJpCLQZThbPRFE6o';
const privateVapidKey = '-hP1DcPrr19YYU467A0xNX45cyAbkD5Rn_ttHUbY6CE';
//setting vapid keys details
webpush.setVapidDetails('mailto:mercymeave@section.com', publicVapidKey,privateVapidKey);

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

app.use("/api/notifications", notificationRouter)
app.use("/api/users", userRouter);
app.use("/api/appointments", appointmentRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/mail", mailRouter);

app.get("/api/hello", (req, res) => {
  console.log("Hello from the server!");
  res.json({ message: "Hello from the server!" });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
