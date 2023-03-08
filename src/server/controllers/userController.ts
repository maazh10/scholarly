import { User } from "../models/user";
import { Request, Response } from "express";

const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  const users = await User.findAll();
  res.json(users);
};

const createUser = async (req: Request, res: Response): Promise<void> => {
  const user = await User.create(req.body);
  res.json(user);
};

export const userController = {
  getAllUsers,
  createUser,
};
