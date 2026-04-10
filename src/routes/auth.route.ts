import {Router} from "express";
import {createUser} from "../controllers/auth.controller"

const authRouter = Router();

authRouter.post("/signup", createUser)

export default authRouter;