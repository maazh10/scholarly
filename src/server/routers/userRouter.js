"use strict";
exports.__esModule = true;
exports.userRouter = void 0;
var userController_1 = require("../controllers/userController");
var express_1 = require("express");
exports.userRouter = (0, express_1.Router)();
exports.userRouter.get("/", userController_1.userController.getAllUsers);
exports.userRouter.post("/", userController_1.userController.createUser);
