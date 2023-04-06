import { User } from "../models/user";
import { Student } from "../models/student";
import { Tutor } from "../models/tutor";
import { Request, Response } from "express";
import { Session } from "express-session";
import bcrypt from "bcrypt";
import { Op } from "sequelize";

interface UserSession extends Session {
  user?: {
    id: number;
  };
}

const signup = async (
  req: Request & { session: UserSession },
  res: Response
) => {
  if (
    !req.body?.email ||
    !req.body?.password ||
    !req.body?.firstName ||
    !req.body?.lastName ||
    !req.body?.userType
  ) {
    res.status(400).json({ error: "Missing required params" });
    return;
  }

  const conflict = await User.findOne({ where: { email: req.body.email } });
  if (conflict) {
    res.status(409).json({ error: "Email already exists. Please login." });
    return;
  }

  if (req.body.password.length < 6) {
    res.status(400).json({ error: "Password must be at least 6 characters" });
    return;
  } else if (
    !req.body.password.match(
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9!@#\$%\^&\*])(?=.{6,})/
    )
  ) {
    res
      .status(400)
      .json({
        error:
          "Password must contain at least one uppercase letter, one lowercase letter and/or one number",
      });
    return;
  }

  let user;
  try {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const password = bcrypt.hashSync(req.body.password, salt);
    user = await User.create({
      firstName: req.body.firstName.toString(),
      lastName: req.body.lastName.toString(),
      email: req.body.email.toString(),
      phoneNumber: req.body.phoneNumber?.toString(),
      bio: req.body.bio?.toString(),
      userType: req.body.userType.toString(),
      password,
    });
    if (req.body.userType === "student") {
      await Student.create({
        UserId: user.dataValues.id,
        school: req.body?.school.toString(),
      });
    } else if (req.body.userType === "tutor") {
      if (!req.body.specialities || !req.body.rate) {
        res.status(400).json({ error: "Missing required params" });
        return;
      }
      await Tutor.create({
        UserId: user.dataValues.id,
        specialities: req.body.specialities,
        rate: req.body.rate.toString(),
      });
    } else {
      res.status(400).json({ error: "Invalid user type" });
      return;
    }
  } catch (e) {
    return res.status(422).json({ error: e.message });
  }
  req.session.user = { id: user.id };
  res.status(201).json({ success: true, email: user.email });
};

const login = async (
  req: Request & { session: UserSession },
  res: Response
) => {
  if (!req.body?.email || !req.body?.password) {
    res.status(400).json({ error: "Missing required params" });
    return;
  }
  const user = await User.findOne({ where: { email: req.body?.email } });
  if (!user) {
    res.status(401).json({ error: "Incorrect email or password" });
    return;
  }
  const passwordMatch = bcrypt.compareSync(req.body.password, user.password);
  if (!passwordMatch) {
    res.status(401).json({ error: "Incorrect email or password" });
    return;
  }
  req.session.user = { id: user.id };
  res.status(200).json({ success: true, user: req.session.user });
};

const logout = async (
  req: Request & { session: UserSession },
  res: Response
) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: "Failed to logout" });
      return;
    }
    res.status(200).json({ success: true });
  });
};

const getUser = async (
  req: Request & { session: UserSession },
  res: Response
) => {
  const user = await User.findOne({
    where: { id: req.session.user.id },
    include: [{ model: Student }, { model: Tutor }],
  });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  if (user.userType === "student") {
    const student = await Student.findOne({ where: { UserId: user.id } });
    res
      .status(200)
      .json({
        user: {
          userId: user.id,
          studentId: student.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          bio: user.bio,
          phoneNumber: user.phoneNumber,
          userType: user.userType,
          school: student?.school,
        },
      });
  } else if (user.userType === "tutor") {
    const tutor = await Tutor.findOne({ where: { UserId: user.id } });
    res
      .status(200)
      .json({
        user: {
          userId: user.id,
          tutorId: tutor.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          bio: user.bio,
          userType: user.userType,
          specialities: tutor?.specialities,
          rate: tutor?.rate,
        },
      });
    return;
  }
};

const getUsers = async (
  req: Request & { session: UserSession },
  res: Response
) => {
  const page = req.query.page ? parseInt(req.query.page.toString()) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit.toString()) : 10;
  const users = await User.findAll({
    offset: page * limit,
    limit,
  });
  res.json({ users: users });
};

const getStudent = async (
  req: Request & { session: UserSession },
  res: Response
) => {
  const student = await Student.findOne({
    where: { UserId: req.params.id },
    include: [{ model: User }],
  });
  if (!student) {
    res.status(404).json({ error: "Student not found" });
    return;
  }
  res.status(200).json({ student: student });
};

const getTutor = async (
  req: Request & { session: UserSession },
  res: Response
) => {
  const tutor = await Tutor.findOne({
    where: { UserId: req.params.id },
    include: [{ model: User }],
  });
  if (!tutor) {
    res.status(404).json({ error: "Tutor not found" });
    return;
  }
  res.status(200).json({ tutor: tutor });
};

const getStudents = async (
  req: Request & { session: UserSession },
  res: Response
) => {
  const page = req.query.page ? parseInt(req.query.page.toString()) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit.toString()) : 10;
  const students = await Student.findAll({
    offset: page * limit,
    limit,
  });
  res.json({ students: students });
};

const getTutors = async (
  req: Request & { session: UserSession },
  res: Response
) => {
  if (!req.query.subject) {
    res.status(400).json({ error: "Missing subject" });
    return;
  }
  const page = req.query.page ? parseInt(req.query.page.toString()) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit.toString()) : 10;
  const subject = req.query.subject.toString();
  const tutors = await Tutor.findAll({
    offset: page * limit,
    limit,
    where: {
      specialities: {
        [Op.contains]: [subject],
      },
    },
    include: [{ model: User }],
  });
  res.json({ tutors: tutors });
};

const updateUser = async (
  req: Request & { session: UserSession },
  res: Response
) => {
  const user = await User.findOne({ where: { id: req.session.user.id } });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  if (req.body.firstName) {
    user.firstName = req.body.firstName;
  }
  if (req.body.lastName) {
    user.lastName = req.body.lastName;
  }
  if (req.body.email) {
    user.email = req.body.email;
  }
  if (req.body.bio) {
    user.bio = req.body.bio;
  }
  if (req.body.phoneNumber) {
    user.phoneNumber = req.body.phoneNumber;
  }
  if (req.body.school) {
    const student = await Student.findOne({ where: { UserId: user.id } });
    if (!student) {
      res.status(404).json({ error: "Student not found" });
      return;
    }
    student.school = req.body.school;
    await student.save();
  }
  if (req.body.specialities) {
    const tutor = await Tutor.findOne({ where: { UserId: user.id } });
    if (!tutor) {
      res.status(404).json({ error: "Tutor not found" });
      return;
    }
    tutor.specialities = req.body.specialities;
    await tutor.save();
  }
  if (req.body.rate) {
    const tutor = await Tutor.findOne({ where: { UserId: user.id } });
    if (!tutor) {
      res.status(404).json({ error: "Tutor not found" });
      return;
    }
    tutor.rate = req.body.rate;
    await tutor.save();
  }
  await user.save();
  res.status(200).json({ success: true });
};

export const userController = {
  signup,
  login,
  logout,
  getUser,
  getUsers,
  getStudent,
  getTutor,
  getStudents,
  getTutors,
  updateUser,
};
