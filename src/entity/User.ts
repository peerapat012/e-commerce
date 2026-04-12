import {Entity, Column, PrimaryColumn, OneToMany, Index} from "typeorm";
import {uuidv7} from "uuidv7";
import {BaseEntity} from "./Base";
import {Cart} from "./Cart";
import {Order} from "./Order";

@Entity()
export class User extends BaseEntity {
    @PrimaryColumn()
    id: string = uuidv7();

    @Column({unique: true})
    @Index()
    email!: string;

    @Column()
    name!: string;

    @Column()
    password!: string;

    @Column({nullable: true})
    refreshToken!: string;

    @OneToMany(() => Cart, (cart) => cart.user)
    carts!: Cart[];

    @OneToMany(() => Order, (order) => order.user)
    orders!: Order[];
}