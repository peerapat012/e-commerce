import {AppDataSource} from "../config/data-source";
import {Product} from "../entity/Product";
import {Request, Response} from 'express'

const repository = AppDataSource.getRepository(Product);

export const GetAllProducts = async (req: Request, res: Response) => {
    const products = await repository.find();

    return res.json({products: products});
}