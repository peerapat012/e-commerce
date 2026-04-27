import { Router } from "express";
import { addToCart, removeFromCart, decreaseOnce } from "../controllers/cart.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const cartRouter = Router();

cartRouter.post("/add",authMiddleware, addToCart);
cartRouter.post("/decrease", authMiddleware, decreaseOnce);
cartRouter.post("/remove", authMiddleware, removeFromCart);

export default cartRouter;