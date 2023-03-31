import { DataTypes, Model } from "sequelize";
import { sequelize } from "../datasource";
import { Student } from "./student";
import { Tutor } from "./tutor";

interface AppointmentAttributes {
    id?: number;
    StudentId?: number;
    TutorId?: number;
    startTime?: Date;
    endTime?: Date;
    subject?: string;
    notes?: string;
}

class Appointment extends Model<AppointmentAttributes> implements AppointmentAttributes {
    public id!: number;
    public StudentId!: number;
    public TutorId!: number;
    public startTime!: Date;
    public endTime!: Date;
    public subject!: string;
    public notes!: string;
}

Appointment.init(
  {
    startTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: false
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false
    },
    notes: {
        type: DataTypes.STRING,
        allowNull: true
    }
  },
  {
    tableName: "appointments",
    sequelize,
  }
);

Appointment.belongsTo(Student);
Student.hasMany(Appointment);
Appointment.belongsTo(Tutor);
Tutor.hasMany(Appointment);

export { Appointment };