import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "../entity/User"
import * as dotenv from "dotenv"
import {Product} from "../entity/Product";
import {Order} from "../entity/Order";
import {OrderItem} from "../entity/OrderItem";
import {Cart} from "../entity/Cart";
import {CartItem} from "../entity/CartItem";

dotenv.config()

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [User, Product, Order, OrderItem, Cart, CartItem],
    subscribers: [],
    migrations: [],
})