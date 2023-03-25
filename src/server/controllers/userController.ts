import { User } from "../models/user";
import { Student } from "../models/student";
import { Tutor } from "../models/tutor";
import { Request, Response } from "express";
import { Op } from "sequelize";
import { Session } from "express-session";
import bcrypt from "bcrypt";

interface UserSession extends Session {
  userId?: number;
}

const signup = async (req: Request & { session: UserSession }, res: Response) => {
  if (!req.body?.email || !req.body?.password || !req.body?.firstName || !req.body?.lastName || !req.body?.userType) {
    res.status(400).json({ error: "missing required params" });
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
      userType: req.body.userType.toString(),
      password,
    });
    if (req.body.userType === 'student') {
      if (!req.body.school) {
        res.status(400).json({ error: "missing required params" });
        return;
      }
      await Student.create({
        UserId: user.dataValues.id,
        school: req.body.school.toString(),
      });
    } else if (req.body.userType === 'tutor') {
      if (!req.body.specialities) {
        res.status(400).json({ error: "missing required params" });
        return;
      }
      await Tutor.create({
        UserId: user.dataValues.id,
        specialities: req.body.specialities,
      });
    } else {
      res.status(400).json({ error: "invalid user type" });
      return;
    }
  } catch(e) {
    return res.status(422).json({ error: e.message });
  }
  req.session.userId = user.id;
  res.status(201).json({ success: true, email: user.email });
};

const login = async (req: Request & { session: UserSession }, res: Response) => {
  if (!req.body?.email || !req.body?.password) {
    res.status(400).json({ error: "missing required params" });
    return;
  }
  const user = await User.findOne({ where: { email: req.body?.email } });
  if (!user) {
    res.status(401).json({ error: "incorrect email or password" });
    return;
  }
  const passwordMatch = bcrypt.compareSync(req.body.password, user.password);
  if (!passwordMatch) {
    res.status(401).json({ error: "incorrect email or password" });
    return;
  }
  req.session.userId = user.id;
  res.status(200).json({ success: true, email: user.email });
}

const logout = async (req: Request & { session: UserSession }, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: "failed to logout" });
      return;
    }
    res.status(200).json({ success: true });
  });
};

const getUser = async (req: Request & { session: UserSession }, res: Response) => {
  const user = await User.findOne({ where: { id: req.session.userId } });
  res.status(200).json({ email: user.email, firstName: user.firstName, lastName: user.lastName, userType: user.userType });
}

const getUsers = async (req: Request & { session: UserSession }, res: Response) => {
  const page = req.query.page ? parseInt(req.query.page.toString()) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit.toString()) : 10;
  const users = await User.findAll({
    offset: page * limit,
    limit,
  });
  res.json({ users: users });
};

const getStudents = async (req: Request & { session: UserSession }, res: Response) => {
  const page = req.query.page ? parseInt(req.query.page.toString()) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit.toString()) : 10;
  const students = await Student.findAll({
    offset: page * limit,
    limit,
  });
  res.json({ students: students });
};

const getTutors = async (req: Request & { session: UserSession }, res: Response) => {
  const page = req.query.page ? parseInt(req.query.page.toString()) : 0;
  const limit = req.query.limit ? parseInt(req.query.limit.toString()) : 10;
  const tutors = await Tutor.findAll({
    offset: page * limit,
    limit,
  });
  res.json({ tutors: tutors });
};

export const userController = {
  signup,
  login,
  logout,
  getUser,
  getUsers,
  getStudents,
  getTutors,
};
