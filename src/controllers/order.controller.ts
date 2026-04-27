import { AppDataSource } from '../config/data-source';
import { Order, OrderStatus } from '../entity/Order';
import { OrderItem } from '../entity/OrderItem';
import { Cart } from '../entity/Cart';
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { CartItem } from '../entity/CartItem';
import { getChannel } from '../utils/rabbitmq';

export const createOrder = async (req: AuthRequest, res: Response) => {
    const user = req.user;

    const order = await AppDataSource.transaction(async (manager) => {

        const cart = await manager.findOne(Cart, {
            where: { user: { id: user?.id } },
            relations: {
                items: {
                    product: true,
                }
            }
        });

        if (!cart || cart.items.length === 0) {
            throw new Error("cart is empty");
        }

        const order = manager.create(Order, {
            user,
            status: OrderStatus.PENDING,
        });

        const orderItems = cart.items.map(item => {
            return manager.create(OrderItem, {
                order: order,
                productId: item.product.id,
                productName: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
            });
        });

        const totalPrice = orderItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );

        order.total_price = totalPrice;

        await manager.save(order);
        await manager.save(orderItems);

        await manager.delete(CartItem, {
            cart: { id: cart.id }
        });

        return order;
    });

    const channel = getChannel();

    await channel.assertQueue("order_created", {
        durable: true,
    });

    channel.sendToQueue("order_created", Buffer.from(JSON.stringify({
        orderId: order.id,
        userId: order.user.id,
    })),
        {
            persistent: true
        }
    );

    return res.status(201).json({ message: "order created successfully", orderId: order.id })
}