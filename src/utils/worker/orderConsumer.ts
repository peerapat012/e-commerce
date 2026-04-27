import { connectRabbitMQ } from "../rabbitmq";
import { AppDataSource } from "../../config/data-source";
import { Order, OrderStatus } from "../../entity/Order";
import { Product } from "../../entity/Product";

export const startOrderConsumer = async () => {
    const { channel } = await connectRabbitMQ();

    channel.consume("order_created", async (msg) => {
        if (!msg) return;

        const data = JSON.parse(msg.content.toString());
        const { orderId, userId } = data;

        console.log(`Received order created event for orderId: ${orderId}, userId: ${userId}`);

        try {

            await AppDataSource.transaction(async (manager) => {
                const order = await manager.findOne(Order, {
                    where: { id: orderId },
                    relations: {
                        items: true,
                    }
                })

                if (!order || order.status !== OrderStatus.PENDING) {
                    console.error(`Order with id ${orderId} is not in a pending state`);
                    return;
                }

                const orderItems = order.items;
                for (const item of orderItems) {
                    const result = await manager
                        .createQueryBuilder()
                        .update(Product)
                        .set({ stock: () => `stock - ${item.quantity}` })
                        .where("id = :id", { id: item.productId })
                        .andWhere("stock >= :qty", { qty: item.quantity })
                        .execute();

                    if (result.affected === 0) {
                        throw new Error(`Insufficient stock for product ${item.productId}`);
                    }
                }

                order.status = OrderStatus.PAID;
                await manager.save(order);
            })

            channel.ack(msg);
            console.log(`Order ${orderId} processed successfully`);
        } catch (err) {
            console.error("Error processing order created event", err);
            await AppDataSource.getRepository(Order).update(orderId, { status: OrderStatus.FAILED });
            channel.nack(msg, false, false);
        }
    });
}