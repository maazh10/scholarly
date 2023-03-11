"use strict";
exports.__esModule = true;
exports.User = void 0;
var sequelize_1 = require("sequelize");
var datasource_1 = require("../datasource");
exports.User = datasource_1.sequelize.define(
  "User",
  {
    firstName: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: sequelize_1.DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "users",
  }
);
