import { Request, Response, NextFunction } from "express";
import { secret } from '../config/auth.json';
import JWT from 'jsonwebtoken';

declare module 'express-serve-static-core' {
    interface Request {
        userId: string;
    }
}

export default function middleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader)
        return res.status(401).json({ error: "No token provided" });

    const parts = authHeader.split(' ');

    if (parts.length !== 2)
        return res.status(401).json({ error: "Token error" });

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme))
        return res.status(401).json({ error: "Token malformated" });

    JWT.verify(token, secret, (err, decoded: any) => {
        if (err) {
            return res.status(401).json({ error: "Token Invalid/expired" });
        };

        req.userId = decoded?.id;

        return next();
    })
}