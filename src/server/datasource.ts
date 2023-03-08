import { Sequelize } from "sequelize";

// get postgres connection details from environment variables
const PG_HOST = process.env.PG_HOST || "localhost";
const PG_PORT = process.env.PG_PORT ? parseInt(process.env.PG_PORT) : 5432;
const PG_DATABASE = process.env.PG_DATABASE || "postgres";
const PG_USER = process.env.PG_USER || "postgres";
const PG_PASSWORD = process.env.PG_PASSWORD || "";

// create a new sequelize instance to connect to postgres database
export const sequelize = new Sequelize(PG_DATABASE, PG_USER, PG_PASSWORD, {
  host: PG_HOST,
  port: PG_PORT,
  dialect: "postgres",
});
