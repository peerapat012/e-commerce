import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { createOrder } from "../controllers/order.controller";

const orderRouter = Router();

orderRouter.post("/create", authMiddleware, createOrder);

export default orderRouter;