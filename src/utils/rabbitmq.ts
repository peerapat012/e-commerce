import * as dotenv from "dotenv";
import amqp, { Channel } from "amqplib";

dotenv.config();
let channel: amqp.Channel | null = null;

export const connectRabbitMQ = async () => {
    const url = process.env.RABBITMQ_URL!;

    let retries = 5;

    while (retries) {
        try {
            const conn = await amqp.connect(url);
            const channel = await conn.createChannel();

            await channel.assertQueue("order_created", {
                durable: true,
            });

            console.log("RabbitMQ connected");
            return { conn, channel };

        } catch (err) {
            console.log("RabbitMQ not ready, retrying...");
            retries--;
            await new Promise(res => setTimeout(res, 3000));
        }
    }

    throw new Error("Failed to connect to RabbitMQ");
}

export const getChannel = (): Channel => {
    if (!channel) throw new Error("RabbitMQ channel is not initialized. Call connectRabbitMQ first.");
    return channel;
}