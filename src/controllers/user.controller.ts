import {Request, Response} from 'express'
import {AppDataSource} from "../config/data-source";
import {User} from "../entity/User";
import {AuthRequest} from "../middleware/auth.middleware";

const repository = AppDataSource.getRepository(User);

export const getAllUsers = async (req: Request, res: Response) => {
    const users = await repository.find();

    return res.status(200).json({users: users});
}

export const getUserProfile = async (req: AuthRequest, res: Response) => {
    return res.status(200).json({user: req.user});
}