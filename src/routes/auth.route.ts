import {Router} from "express";
import {createUser, signin, refresh} from "../controllers/auth.controller"

const authRouter = Router();

authRouter.post("/signup", createUser)
authRouter.post("/signin", signin);
authRouter.post("/refresh", refresh);

export default authRouter;