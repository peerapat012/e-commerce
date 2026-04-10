import app from "./app";
import {AppDataSource} from "./config/data-source";
import {seedProducts} from "./utils/product-seed";

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
    .then(async () => {
        console.log("DB connected");

        await seedProducts();

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => console.error(err));