import express, {Request, Response} from 'express'
import {AppDataSource} from "../config/data-source";
import {User} from "../entity/User";
import {validateDto} from "../utils/validateDto";
import CreateUserDto from "../Dto/createUser.dto";
import bcrypt from "bcrypt";

const repo = AppDataSource.getRepository(User);

export const createUser = async (req: Request, res: Response) => {
    const errors = await validateDto(CreateUserDto, req.body);

    if(errors){
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

export const getUser = async (req: Request, res: Response) => {
    const {id} = req.params;
    const user = await repo.createQueryBuilder("user")
        .where("user.id = :id", {id: id})
        .getOne();

    if (!user) {
        res.status(404).send({"message": "User not found"})
    }

    return res.status(200).send(user)
}