import express, {Express} from 'express'
import {loggingMiddleware} from "./middleware/logging.middleware";
import healthcheckRoute from "./routes/healthcheck.route";
import userRouter from "./routes/user.route"
import authRouter from "./routes/auth.route";
import productRouter from "./routes/product.route";
import cartRouter from "./routes/cart.route";

const app: Express = express()

const port: number = 3000

app.use(express.json())
app.use(loggingMiddleware);

app.use("/healthcheck", healthcheckRoute);
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/cart", cartRouter);


export default app;