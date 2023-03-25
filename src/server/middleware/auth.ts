import { Session } from "express-session";
import { Request, Response, NextFunction } from "express";

interface UserSession extends Session {
    userId?: number;
}

export const isAuthenticated = function (req: Request & { session: UserSession }, res: Response, next: NextFunction) {
    if (!req.session.userId)
        return res.status(401).json({ error: "unauthenticated" });
    next();
};