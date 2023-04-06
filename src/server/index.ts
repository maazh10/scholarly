import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
import { sequelize } from "./datasource";

import session from "express-session";
import cors from "cors";

import { userRouter } from "./routers/userRouter";
import { appointmentRouter } from "./routers/appointmentRouter";
import { sessionRouter } from "./routers/sessionRouter";
import { mailRouter } from "./routers/mailRouter";

export const app = express();
app.use(bodyParser.json());

const whiteList = [
  "http://localhost:3000",
  process.env.PROD_FRONTEND_URL,
  process.env.PROD_BACKEND_URL,
  "https://api.scholarly-c09.tech",
];
const corsOptionsDelegate = function (
  req: { header: (arg0: string) => string },
  callback: (
    arg0: any,
    arg1: { origin: boolean; credentials?: boolean }
  ) => void
): void {
  var corsOptions: { origin: boolean; credentials?: boolean };
  console.log(req.header("Origin"));
  if (whiteList.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true, credentials: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

if (process.env.NODE_ENV === "production") {
  console.log("Whitelisting");
  app.use(cors({ origin: true, credentials: true }));
} else {
  console.log("Using cors");
  app.use(cors(corsOptionsDelegate));
}

(async () => {
  await sequelize.sync({ alter: { drop: false } });
  console.log("Connected to database!");
})();

app.use(
  session({
    secret: "test",
    resave: false,
    saveUninitialized: true,
  })
);

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
