import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import generateAuthToken from "../config/generateAuthToken";
import { refreshSecret } from '../config/auth.json';

declare module 'express-serve-static-core' {
    interface Request {
        userId: string;
    }
}

export default {
    create(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.body;



            if (!refreshToken)
                return res.status(401).json({ error: "No token provided" });

            const parts = refreshToken.split(' ');

            if (parts.length !== 2)
                return res.status(401).json({ error: "Token error" });

            const [scheme, token] = parts;

            if (!/^Bearer$/i.test(scheme))
                return res.status(401).json({ error: "Token malformated" });

            JWT.verify(token, refreshSecret, async (err, decoded: any) => {
                if (!err) {
                    const token = await generateAuthToken(decoded.id);

                    return res.json(token)
                } else {
                    return res.status(401).json(err);
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
}