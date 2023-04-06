import { Session } from "express-session";
import { Request, Response, NextFunction } from "express";

interface UserSession extends Session {
  user?: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    userType: string;
  };
}

export const isAuthenticated = function (
  req: Request & { session: UserSession },
  res: Response,
  next: NextFunction
) {
  if (!req.session.user)
    return res.status(401).json({ error: "unauthenticated" });
  next();
};
