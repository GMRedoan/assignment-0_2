import type { NextFunction, Request, Response } from "express";

export const authorizeRoles = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new Error("User Not Found");
        }

        if (!roles.includes(req.user.role)) {
            throw new Error(
                "You are not authorize to perform insufficient role",
            );
        }
        next();
    };
};