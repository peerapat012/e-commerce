import {
    Entity,
    Column,
    ManyToOne,
    OneToMany, PrimaryColumn, Index
} from "typeorm";
import {User} from "./User";
import {OrderItem} from "./OrderItem";
import {uuidv7} from "uuidv7";
import {BaseEntity} from "./Base";

export enum OrderStatus {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed"
}

@Entity()
export class Order extends BaseEntity {
    @PrimaryColumn()
    id: string = uuidv7();

    @ManyToOne(() => User, (user) => user.orders)
    @Index()
    user!: User;

    @Column({
        type: "enum",
        enum: OrderStatus,
        default: OrderStatus.PENDING
    })
    @Index()
    status!: OrderStatus;

    @Column("decimal")
    total_price!: number;

    @OneToMany(() => OrderItem, (item) => item.order, {
        cascade: true
    })
    items!: OrderItem[];
}