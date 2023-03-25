import { DataTypes, Model } from "sequelize";
import { sequelize } from "../datasource";
import { User } from "./user";

interface TutorAttributes {
    UserId?: number;
    specialities?: string[];
}

class Tutor extends Model<TutorAttributes> implements TutorAttributes {
    public specialities!: string[];
}

Tutor.init(
  {
    specialities: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    }
  },
  {
    tableName: "tutors",
    sequelize,
  }
);

Tutor.belongsTo(User);
User.hasOne(Tutor);

export { Tutor };
