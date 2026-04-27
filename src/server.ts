import app from "./app";
import { AppDataSource } from "./config/data-source";
import { seedProducts } from "./utils/product-seed";
import { connectRabbitMQ } from "./utils/rabbitmq";
import { startOrderConsumer } from "./utils/worker/orderConsumer";

const PORT = process.env.PORT || 3000;


AppDataSource.initialize()
    .then(async () => {
        console.log("DB connected");

        await seedProducts();
        await connectRabbitMQ();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => console.error(err));