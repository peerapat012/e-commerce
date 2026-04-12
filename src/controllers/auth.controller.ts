import express, {Request, Response} from 'express'
import {AppDataSource} from "../config/data-source";
import {User} from "../entity/User";
import {validateDto} from "../utils/validateDto";
import CreateUserDto from "../Dto/createUser.dto";
import bcrypt from "bcrypt";
import {generateAccessToken, generateRefreshToken, verifyRefreshToken} from "../utils/jwt";

const repo = AppDataSource.getRepository(User);

export const createUser = async (req: Request, res: Response) => {
    const errors = await validateDto(CreateUserDto, req.body);

    if (errors) {
        return res.status(400).send({errors});
    }

    const {name, email, password} = req.body;

    // hash password
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    // new user
    const user = new User()
    user.name = name;
    user.email = email;
    user.password = hashPassword;

    await repo.save(user);

    return res.status(201).send({message: "User created", user: user})
}

export const login = async (req: Request, res: Response) => {
    const {email, password} = req.body;

    const user = await repo.findOne({
        where: {
            email: email
        }
    })

    if (!user) {
        return res.status(404).send({"message": "Invalid email or password"})
    }

    const isMatchPassword = await bcrypt.compare(password, user!.password);
    if (!isMatchPassword) {
        return res.status(401).send({"message": "Invalid email or password"})
    }

    const payload = {userId: user.id, email: user.email}

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    user.refreshToken = refreshToken

    await repo.save(user)

    return res.status(201).send({accessToken: accessToken, refreshToken: refreshToken})
}

export const refresh = async (req: Request, res: Response) => {
    const {refreshToken} = req.body;
    if (!refreshToken) {
        return res.status(401).send({"message": "Invalid refresh token"})
    }

    try {
        const decoded: any = verifyRefreshToken(refreshToken);
        const existRefreshToken = await repo.findOne({
            where: {
                refreshToken: refreshToken
            }
        })

        if (!existRefreshToken) {
            return res.status(401).send({"message": "Invalid refresh token"})
        }

        const newAccessToken = generateAccessToken({
            userId: decoded.userId,
            email: decoded.email,
        })

        return res.status(200).send({accessToken: newAccessToken})
    } catch (error) {
        return res.status(403).send({"message": "Invalid refresh token"})
    }
}