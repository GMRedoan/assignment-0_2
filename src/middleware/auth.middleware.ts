import jwt, { type JwtPayload } from "jsonwebtoken";
import type { NextFunction, Request, Response } from "express";
import config from "../config";

type TDecodedUser = JwtPayload & {
    id: number;
    name: string;
    role: "contributor" | "maintainer";
};

const auth = async (req: Request, res: Response, next: NextFunction) => {
        const authorizationToken = req.headers.authorization;

        if (!authorizationToken) {
            throw new Error("You Are Not Authorized");
        }

        const decode = jwt.verify(
            authorizationToken,
            config.jwt_secret as string,
        ) as TDecodedUser;

        req.user = decode;

        const allowedRoles = ["contributor", "maintainer"];
        if (!allowedRoles.includes(req.user.role)) {
            throw new Error(
                 "Only contributors or maintainers can create issues",
            );
        }

        next();
    }

export default auth;