import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
import { sequelize } from "./datasource";
import { userRouter } from "./routers/userRouter";
import session from 'express-session';

export const app = express();
app.use(bodyParser.json());

app.use(session({
  secret: ':)',
  resave: false,
  saveUninitialized: true
}));

(async () => {
  await sequelize.sync({ alter: { drop: false } });
  console.log("Connected to database!");
})();

app.use("/api/users", userRouter);

app.get("/api/hello", (req, res) => {
  console.log("Hello from the server!");
  res.json({ message: "Hello from the server!" });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
