import {Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, PrimaryColumn, Index} from "typeorm";
import { User } from "./User";
import { CartItem } from "./CartItem";
import {uuidv7} from "uuidv7";
import {BaseEntity} from "./Base";

@Entity()
export class Cart extends BaseEntity{
    @PrimaryColumn()
    id: string = uuidv7();

    @ManyToOne(() => User, (user) => user.carts)
    @Index()
    user!: User;

    @OneToMany(() => CartItem, (item) => item.cart, {
        cascade: true
    })
    items!: CartItem[];
}