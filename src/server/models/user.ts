import { DataTypes, Model } from "sequelize";
import { sequelize } from "../datasource";

interface UserAttributes {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: string;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public password!: string;
  public userType!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init(
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["student", "tutor"]],
      },
    }
  },
  {
    tableName: "users",
    sequelize,
  }
);

export { User };
