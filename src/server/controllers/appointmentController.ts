import { Session } from "express-session";
import { Request, Response } from "express";
import { Appointment } from "../models/appointment";
import { User } from "../models/user";
import { Tutor } from "../models/tutor";
import { Student } from "../models/student";

interface UserSession extends Session {
    user?: {
      id: number;
    };
}

const createAppointment = async (req: Request & { session: UserSession }, res: Response) => {
    const user = await User.findByPk(req.session.user.id);
    if(user.userType !== "student") {
        res.status(403).json({ message: "Unauthorized" });
        return;
    }
    const student = await Student.findOne(
        { where: { UserId: user.id } }
    )
    if(!req.body.tutorId || !req.body.startTime || !req.body.endTime || !req.body.subject) {
        res.status(400).json({ message: "Missing tutorId, studentId, startTime, or endTime" });
        return;
    }
    const start = new Date(req.body.startTime);
    const end = new Date(req.body.endTime);
    const appointment = await Appointment.create({
        TutorId: req.body.tutorId,
        StudentId: student.id,
        startTime: start,
        endTime: end,
        subject: req.body.subject,
        notes: req.body.notes,
    });
    res.status(200).json({ success: true, appointment: appointment });
};

const getAppointments = async (req: Request & { session: UserSession }, res: Response) => {
    const user = await User.findByPk(req.session.user.id);
    if(user.userType === "student") {
        const student = await Student.findOne(
            { where: { UserId: user.id } }
        )
        const appointments = await Appointment.findAll(
            { where: { StudentId: student.id } }
        )
        res.status(200).json({ appointments: appointments });
        return;
    }
    const tutor = await Tutor.findOne(
        { where: { UserId: user.id } }
    )
    const appointments = await Appointment.findAll(
        { where: { TutorId: tutor.id } }
    )
    res.status(200).json({ appointments: appointments });
};

const getAppointment = async (req: Request & { session: UserSession }, res: Response) => {
    if(!req.params.id) {
        res.status(400).json({ message: "Missing appointmentId" });
        return;
    }
    const appointmentId = req.params.id;
    const appointment = await Appointment.findByPk(appointmentId);
    if(!appointment) {
        res.status(404).json({ message: "Appointment not found" });
        return;
    }
    res.status(200).json({ success: true, appointment: appointment });
};

const updateAppointment = (req: Request & { session: UserSession }, res: Response) => {
    res.status(200).json({ message: "Appointment updated" });
};

const deleteAppointment = (req: Request & { session: UserSession }, res: Response) => {
    res.status(200).json({ message: "Appointment deleted" });
};

export const appointmentController = {
    createAppointment,
    getAppointments,
    getAppointment,
    updateAppointment,
    deleteAppointment,
};