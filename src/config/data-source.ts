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
    url: process.env.DATABASE_URL,
    synchronize: true,
    logging: true,
    entities: [User, Product, Order, OrderItem, Cart, CartItem],
    subscribers: [],
    migrations: [],
})