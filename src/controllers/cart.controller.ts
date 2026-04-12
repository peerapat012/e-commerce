import {AppDataSource} from "../config/data-source";
import {Cart} from "../entity/Cart";
import {Request, Response} from "express";
import {CartItem} from "../entity/CartItem";

const cartRepository = AppDataSource.getRepository(Cart);
const cartItemRepository = AppDataSource.getRepository(CartItem);

export const addToCart = async (req: Request, res: Response) => {
    const {userId, productId} = req.body;
    // check if cart exist
    let cart = await cartRepository.findOne({
        where: {
            user: {
                id: userId,
            }
        },
        relations: {
            items: true,
        },
    });

    // if cart not exist create user cart
    if (!cart) {
        cart = cartRepository.create({
            user: {id: userId},
        });

        cart = await cartRepository.save(cart);
    }

    // check productItem exist

    const existProductItem = await cartItemRepository.findOne({
        where: {
            cart: {id: cart.id},
            product: {id: productId}
        },
    });

    if (existProductItem) {
        existProductItem.quantity += 1;
        await cartItemRepository.save(existProductItem);
    } else {
        const newProductItem = cartItemRepository.create({
            cart: {id: cart.id},
            product: {id: productId},
            quantity: 1,
        });

        await cartItemRepository.save(newProductItem);
    }

    return res.status(200).json({cart: cart})
}

export const removeFromCart = async (req: Request, res: Response) => {
    const {userId, productId} = req.body;

    // check user cart exist
    let cart = await cartRepository.findOne({
        where: {
            user: {
                id: userId,
            },
        },
        relations: {
            items: true,
        },
    });

    if (cart) {

    } else {

    }
}

export const decreaseOnce = async (req: Request, res: Response) => {
    const {userId, productId} = req.body;

    let cart = await cartRepository.findOne({
        where: {
            user: {
                id: userId,
            }
        },
        relations: {
            items: true,
        }
    });

    if(!cart){
        return res.status(404).json({message: "cart not found"})
    }

    
}