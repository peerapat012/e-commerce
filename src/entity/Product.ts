import {Entity, Column, OneToMany, PrimaryColumn, Index} from "typeorm";
import {CartItem} from "./CartItem";
import {OrderItem} from "./OrderItem";
import {uuidv7} from "uuidv7";
import {BaseEntity} from "./Base";

@Entity()
export class Product extends BaseEntity {
    @PrimaryColumn()
    id: string = uuidv7();

    @Column()
    @Index()
    name!: string;

    @Column("decimal")
    price!: number;

    @Column()
    @Index()
    stock!: number;

    @OneToMany(() => CartItem, (item) => item.product)
    cartItems!: CartItem[];

    @OneToMany(() => OrderItem, (item) => item.product)
    orderItems!: OrderItem[];
}