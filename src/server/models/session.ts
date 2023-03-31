import { DataTypes, Model } from "sequelize";
import { sequelize } from "../datasource";
import { Appointment } from "./appointment";

interface SessionAttributes {
    AppointmentId?: number;
    peerId?: string;
}

class Session extends Model<SessionAttributes> implements SessionAttributes {
    public peerId!: string;
}

Session.init(
  {
    peerId: {
        type: DataTypes.STRING,
        allowNull: false
    }
  },
  {
    tableName: "sessions",
    sequelize,
  }
);

Session.belongsTo(Appointment);
Appointment.hasOne(Session);

export { Session };