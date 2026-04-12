import {Router} from "express";
import {createUser, login, refresh} from "../controllers/auth.controller"

const authRouter = Router();

authRouter.post("/signup", createUser)
authRouter.post("/login", login);
authRouter.post("/refresh", refresh);

export default authRouter;