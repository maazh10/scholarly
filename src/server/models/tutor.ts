import { DataTypes, Model } from "sequelize";
import { sequelize } from "../datasource";
import { User } from "./user";

interface TutorAttributes {
    UserId?: number;
    specialities?: string[];
    rate?: number;
}

class Tutor extends Model<TutorAttributes> implements TutorAttributes {
    public specialities!: string[];
    public rate!: number;
}

Tutor.init(
  {
    specialities: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false
    },
    rate: {
        type: DataTypes.FLOAT,
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
