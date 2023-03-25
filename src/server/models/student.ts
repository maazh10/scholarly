import { DataTypes, Model } from "sequelize";
import { sequelize } from "../datasource";
import { User } from "./user";

interface StudentAttributes {
    UserId?: number;
    school?: string;
}

class Student extends Model<StudentAttributes> implements StudentAttributes {
    public school!: string;
}

Student.init(
  {
    school: {
        type: DataTypes.STRING,
        allowNull: false
    }
  },
  {
    tableName: "students",
    sequelize,
  }
);

Student.belongsTo(User);
User.hasOne(Student);

export { Student };
