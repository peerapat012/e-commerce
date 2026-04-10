import express, {Request, Response} from 'express'
import {AppDataSource} from "../config/data-source";
import {User} from "../entity/User";

const repository = AppDataSource.getRepository(User);

export const getAllUsers = async (req: Request, res: Response) => {
    const users = await repository.find();

    return res.status(200).json({users: users});
}