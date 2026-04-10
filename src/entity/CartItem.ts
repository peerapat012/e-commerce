import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn, Index} from "typeorm";
import {Cart} from "./Cart";
import {Product} from "./Product";
import {uuidv7} from "uuidv7";
import {BaseEntity} from "./Base";

@Entity()
@Index(["cart", "product"]) // composite index
export class CartItem extends BaseEntity {
    @PrimaryColumn()
    id: string = uuidv7();

    @ManyToOne(() => Cart, (cart) => cart.items)
    cart!: Cart;

    @ManyToOne(() => Product, (product) => product.cartItems)
    product!: Product;

    @Column()
    quantity!: number;
}