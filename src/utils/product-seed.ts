import { faker } from "@faker-js/faker";
import {Product} from "../entity/Product";
import {AppDataSource} from "../config/data-source";

export const generateProducts = (count: number): Partial<Product>[] => {
    const products: Partial<Product>[] = [];

    for (let i = 0; i < count; i++) {
        products.push({
            name: faker.commerce.productName(),
            price: Number(faker.commerce.price({ min: 100, max: 50000 })),
            stock: faker.number.int({ min: 0, max: 100 })
        });
    }

    return products;
};

export const seedProducts = async () => {
    const repo = AppDataSource.getRepository(Product);

    const count = await repo.count();
    if (count > 0) return;

    console.log("Seeding products...");

    const fakeProducts = generateProducts(50);
    const entities = repo.create(fakeProducts);

    await repo.save(entities);

    console.log("Done!");
};