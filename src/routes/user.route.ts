import {Router} from "express";
import * as userController from "../controllers/user.controller";
import {authMiddleware} from "../middleware/auth.middleware";

const userRouter = Router();

userRouter.get("/", userController.getAllUsers)
userRouter.get("/profile", authMiddleware,userController.getUserProfile)

export default userRouter;