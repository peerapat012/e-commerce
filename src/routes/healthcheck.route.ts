import {Router, Request, Response} from "express";

const healthcheckRoute = Router();

healthcheckRoute.get("/", (req: Request, res: Response) => {
    res.status(200).send({message: "Healthcheck routes"})
})

export default healthcheckRoute;