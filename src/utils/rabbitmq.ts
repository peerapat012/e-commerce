import * as dotenv from "dotenv";
import amqp from "amqplib";

dotenv.config();
let channel: amqp.Channel;

export const connectRabbitMQ = async () => {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);
    channel = await connection.createChannel();

    await channel.assertQueue("order_created", { durable: true });

    return { connection, channel };
}

export const getChannel = () => {
    if(!channel) throw new Error("RabbitMQ channel is not initialized. Call connectRabbitMQ first.");
    return channel;
}