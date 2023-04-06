import { Session } from "express-session";
import { Request, Response } from "express";
import { Appointment } from "../models/appointment";
import { User } from "../models/user";
import { Tutor } from "../models/tutor";
import { Student } from "../models/student";
import { Op } from "sequelize";
import moment from "moment";
import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

interface UserSession extends Session {
  user?: {
    id: number;
  };
}

const confirmAppointment = async (phoneNumber: string): Promise<boolean> => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
  const client = twilio(accountSid, authToken);
  const formattedNumber = "+1" + phoneNumber.replace("/-/g", "");
  await client.messages.create({
    body: "Reply with 'yes' to confirm your appointment, you have 10 seconds to respond.",
    from: twilioNumber,
    to: formattedNumber,
  });
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
  const curtime = new Date();
  await sleep(15000);
  const messages = await client.messages.list({
    limit: 20,
    from: formattedNumber,
    dateSentAfter: curtime,
  });
  const message = messages.find((message) => message.body === "yes");
  if (message) {
    return true;
  }
  return false;
};

const createAppointment = async (
  req: Request & { session: UserSession },
  res: Response
) => {
  const user = await User.findByPk(req.session.user.id);
  if (user.userType !== "student") {
    res.status(403).json({ message: "Unauthorized" });
    return;
  }
  const student = await Student.findOne({ where: { UserId: user.id } });
  if (
    !req.body.tutorId ||
    !req.body.startTime ||
    !req.body.endTime ||
    !req.body.subject
  ) {
    res
      .status(400)
      .json({ message: "Missing tutorId, studentId, startTime, or endTime" });
    return;
  }
  const start = new Date(req.body.startTime);
  const end = new Date(req.body.endTime);
  const appointmentConfirmation = await confirmAppointment(user.phoneNumber);
  if (!appointmentConfirmation) {
    res.status(400).json({ message: "Appointment not confirmed" });
    return;
  }
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

const getAppointments = async (
  req: Request & { session: UserSession },
  res: Response
) => {
  const user = await User.findByPk(req.session.user.id);
  let appointments;
  if (req.query.start && req.query.end) {
    const start = moment(req.query.start.toString()).toDate();
    const end = moment(req.query.end.toString()).toDate();
    if (user.userType === "student") {
      const student = await Student.findOne({ where: { UserId: user.id } });
      appointments = await Appointment.findAll({
        where: {
          StudentId: student.id,
          startTime: {
            [Op.between]: [start, end],
          },
        },
        include: [
          {
            model: Tutor,
            include: [
              {
                model: User,
              },
            ],
          },
          {
            model: Student,
            include: [
              {
                model: User,
              },
            ],
          },
        ],
      });
    } else {
      const tutor = await Tutor.findOne({ where: { UserId: user.id } });
      appointments = await Appointment.findAll({
        where: {
          TutorId: tutor.id,
          startTime: {
            [Op.between]: [start, end],
          },
        },
        include: [
          {
            model: Tutor,
            include: [
              {
                model: User,
              },
            ],
          },
          {
            model: Student,
            include: [
              {
                model: User,
              },
            ],
          },
        ],
      });
    }
  } else {
    if (user.userType === "student") {
      const student = await Student.findOne({ where: { UserId: user.id } });
      appointments = await Appointment.findAll({
        where: { StudentId: student.id },
      });
    } else {
      const tutor = await Tutor.findOne({ where: { UserId: user.id } });
      appointments = await Appointment.findAll({
        where: { TutorId: tutor.id },
      });
    }
  }

  res.status(200).json({ appointments: appointments });
};

const getAppointment = async (
  req: Request & { session: UserSession },
  res: Response
) => {
  if (!req.params.id) {
    res.status(400).json({ message: "Missing appointmentId" });
    return;
  }
  const appointmentId = req.params.id;
  const appointment = await Appointment.findByPk(appointmentId);
  if (!appointment) {
    res.status(404).json({ message: "Appointment not found" });
    return;
  }
  res.status(200).json({ success: true, appointment: appointment });
};

const updateAppointment = async (
  req: Request & { session: UserSession },
  res: Response
) => {
  if (!req.params.id) {
    res.status(400).json({ message: "Missing appointmentId" });
    return;
  }
  const appointmentId = parseInt(req.params.id);
  const appointment = await Appointment.findByPk(appointmentId);
  if (!appointment) {
    res.status(404).json({ message: "Appointment not found" });
    return;
  }
  const startTime = req.body.startTime
    ? new Date(req.body.startTime)
    : appointment.startTime;
  const endTime = req.body.endTime
    ? new Date(req.body.endTime)
    : appointment.endTime;
  const subject = req.body.subject ? req.body.subject : appointment.subject;
  const notes = req.body.notes ? req.body.notes : appointment.notes;
  const updatedAppointment = await Appointment.update(
    {
      startTime,
      endTime,
      subject,
      notes,
    },
    { where: { id: appointmentId } }
  );
  res.status(200).json({ success: true, appointment: updatedAppointment });
};

const deleteAppointment = async (
  req: Request & { session: UserSession },
  res: Response
) => {
  if (!req.params.id) {
    res.status(400).json({ message: "Missing appointmentId" });
    return;
  }
  const appointmentId = parseInt(req.params.id);
  const appointment = await Appointment.destroy({
    where: { id: appointmentId },
  });
  res.status(200).json({ success: true, appointment: appointment });
};

export const appointmentController = {
  createAppointment,
  getAppointments,
  getAppointment,
  updateAppointment,
  deleteAppointment,
};
