import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, PrimaryColumn, Index} from "typeorm";
import {Order} from "./Order";
import {Product} from "./Product";
import {uuidv7} from "uuidv7";
import {BaseEntity} from "./Base";

@Entity()
@Index(["order", "product"])
export class OrderItem extends BaseEntity{
    @PrimaryColumn()
    id: string = uuidv7();

    @ManyToOne(() => Order, (order) => order.items)
    order!: Order;

    @ManyToOne(() => Product, (product) => product.orderItems)
    product!: Product;

    @Column()
    quantity!: number;

    @Column("decimal")
    price!: number;
}