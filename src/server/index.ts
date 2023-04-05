import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
import { sequelize } from "./datasource";

import session from 'express-session';
import cors from "cors"

import { userRouter } from "./routers/userRouter";
import { appointmentRouter } from "./routers/appointmentRouter";
import { sessionRouter } from "./routers/sessionRouter";
import { mailRouter } from "./routers/mailRouter";

export const app = express();
app.use(bodyParser.json());

const whiteList = ['http://localhost:3000', process.env.PROD_FRONTEND_URL, process.env.PROD_BACKEND_URL, "https://api.scholarly-c09.tech"]
var corsOptionsDelegate = function (req, callback) {
	  var corsOptions;
	    if (whiteList.indexOf(req.header('Origin')) !== -1) {
		        corsOptions = { origin: true, credentials:true } // reflect (enable) the requested origin in the CORS response
	    } else {
		corsOptions = { origin: false } // disable CORS for this request
		}
		callback(null, corsOptions) // callback expects two parameters: error and options
	}
const corsOptions = {
origin: (origin, callback) => {
	if (whiteList.indexOf(origin) !== -1) {
		callback(null, true)
	} else {
		console.log(origin);
		callback(new Error(`Origin not in list, ${origin}`))
	}
},
credentials: true
}
app.use(cors(corsOptionsDelegate));

app.use(cors({origin: true, credentials: true}));

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

app.get("/api/hello", (req, res) => {
  console.log("Hello from the server!");
  res.json({ message: "Hello from the server!" });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
