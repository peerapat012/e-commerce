import {Router} from "express";
import * as userController from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/", userController.getAllUsers)

export default userRouter;