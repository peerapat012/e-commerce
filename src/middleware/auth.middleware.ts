import jwt from "jsonwebtoken";
import {NextFunction, Request, Response} from "express";
import {AppDataSource} from "../config/data-source";
import {User} from "../entity/User";

export interface AuthRequest extends Request {
    user?: User
}

const usersRepository = AppDataSource.getRepository(User);

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) return res.status(401).send({"message": "Invalid token"})

    const token = authHeader.split(' ')[1];

    try {
        const decoded: any = jwt.verify(token, String(process.env.ACCESS_SECRET));

        const user = await usersRepository.findOne({
            where: {
                id: decoded.userId,
                email: decoded.email
            }
        })

        if (!user) return res.status(401).send({"message": "Invalid token"})

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).send({"message": "Invalid token"})
    }
}