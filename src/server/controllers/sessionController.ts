import { Session as ExpressSession } from "express-session";
import { Request, Response } from "express";
import { Session } from "../models/session";
import { Appointment } from "../models/appointment";
import { User } from "../models/user";
import { Tutor } from "../models/tutor";
import { Student } from "../models/student";

interface UserSession extends ExpressSession {
    user?: {
      id: number;
    };
}

const createSession = async (req: Request & { session: UserSession }, res: Response) => {
    if(!req.body.appointmentId) {
        res.status(400).json({ message: "Missing appointmentId" });
        return;
    }
    const conflict = await Session.findOne({
        where: {
            AppointmentId: req.body.appointmentId,
        },
    });
    if(conflict) {
        res.status(409).json({ message: "Session already exists" });
        return;
    }
    const appointment = await Appointment.findByPk(req.body.appointmentId);
    if(!appointment) {
        res.status(404).json({ message: "Appointment not found" });
        return;
    }
    const user = await User.findByPk(req.session.user.id, { include: [Tutor, Student] });
    if(user.userType === "tutor") {
        if(user.Tutor.id !== appointment.TutorId) {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }
    }
    else if(user.userType === "student") {
        if(user.Student.id !== appointment.StudentId) {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }
    }
    if(!req.body.peerId) {
        res.status(400).json({ message: "Missing a peerId" });
        return;
    }
    const session = await Session.create({
        AppointmentId: req.body.appointmentId,
        peerId: req.body.peerId,
    });
    res.status(200).json({ sucess: true, session: session });
};

const getSession = async (req: Request & { session: UserSession }, res: Response) => {
    if(!req.query.appointmentId) {
        res.status(400).json({ message: "Missing appointmentId" });
        return;
    }
    const appointment = await Appointment.findByPk(req.query.appointmentId.toString());
    if(!appointment) {
        res.status(404).json({ message: "Appointment not found" });
        return;
    }
    const user = await User.findByPk(req.session.user.id);
    if(user.userType === "tutor") {
        const tutor = await Tutor.findOne({
            where: {
                UserId: req.session.user.id,
            },
        });
        if(!tutor) {
            res.status(404).json({ message: "Tutor not found" });
            return;
        }
        if(tutor.id !== appointment.TutorId) {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }
    }
    else if(user.userType === "student") {
        const student = await Student.findOne({
            where: {
                UserId: req.session.user.id,
            },
        });
        if(!student) {
            res.status(404).json({ message: "Student not found" });
            return;
        }
        if(student.id !== appointment.StudentId) {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }
    }
    const session = await Session.findOne({
        where: {
            AppointmentId: req.query.appointmentId.toString(),
        },
    });
    if(!session) {
        res.status(404).json({ message: "Session not found" });
        return;
    }
    res.status(200).json({ sucess: true, session: session });
};

const deleteSession = async (req: Request & { session: UserSession }, res: Response) => {
    if(!req.query.appointmentId)
        res.status(400).json({ message: "Missing appointmentId" });
    const session = Session.destroy({
        where: {
            AppointmentId: req.query.appointmentId.toString(),
        },
    });
    if(!session)
        res.status(404).json({ message: "Session not found" });
    res.status(200).json({ success: true, session: session });
};

export const sessionController = {
    createSession,
    getSession,
    deleteSession,
};