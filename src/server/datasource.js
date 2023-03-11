"use strict";
exports.__esModule = true;
exports.sequelize = void 0;
var sequelize_1 = require("sequelize");
// get postgres connection details from environment variables
var PG_HOST = process.env.PG_HOST || "localhost";
var PG_PORT = process.env.PG_PORT ? parseInt(process.env.PG_PORT) : 5432;
var PG_DATABASE = process.env.PG_DATABASE || "postgres";
var PG_USER = process.env.PG_USER || "postgres";
var PG_PASSWORD = process.env.PG_PASSWORD || "";
// create a new sequelize instance to connect to postgres database
exports.sequelize = new sequelize_1.Sequelize(
  PG_DATABASE,
  PG_USER,
  PG_PASSWORD,
  {
    host: PG_HOST,
    port: PG_PORT,
    dialect: "postgres",
  }
);
