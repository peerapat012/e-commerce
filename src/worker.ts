import { AppDataSource } from "./config/data-source";
import { connectRabbitMQ } from "./utils/rabbitmq";
import { startOrderConsumer } from "./utils/worker/orderConsumer";

const start = async () => {
    await AppDataSource.initialize();
    console.log("DB connected (worker)");

    await connectRabbitMQ();
    console.log("RabbitMQ connected (worker)");

    await startOrderConsumer();
};

start().catch(console.error);