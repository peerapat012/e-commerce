import {Router} from "express";
import {GetAllProducts} from "../controllers/product.controller";

const productRouter = Router();

productRouter.get("/", GetAllProducts);

export default productRouter