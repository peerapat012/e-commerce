import { AppDataSource } from "../config/data-source";
import { Cart } from "../entity/Cart";
import { Request, Response } from "express";
import { CartItem } from "../entity/CartItem";
import { AuthRequest } from "../middleware/auth.middleware";
import { Product } from "../entity/Product";

const cartRepository = AppDataSource.getRepository(Cart);
const cartItemRepository = AppDataSource.getRepository(CartItem);
const productRepository = AppDataSource.getRepository(Product);

export const addToCart = async (req: AuthRequest, res: Response) => {
    const { productId } = req.body;
    const user = req.user
    // check if cart exist
    let cart = await cartRepository.findOne({
        where: {
            user: {
                id: user?.id,
            }
        },
        relations: {
            items: true,
        },
    });

    // if cart not exist create user cart
    if (!cart) {
        cart = cartRepository.create({
            user: { id: user?.id },
        });

        cart = await cartRepository.save(cart);
    }

    //check if product exist
    const existProduct = await productRepository.findOne({
        where: {
            id: productId,
        },
    })

    if(!existProduct) {
        return res.status(404).json({ message: "product not found" })
    }

    // check cartItem exist
    const existCartItem = await cartItemRepository.findOne({
        where: {
            cart: {id: cart.id},
            product: {id: existProduct.id}
        },
    });

    if (existCartItem) {
        existCartItem.quantity += 1;
        await cartItemRepository.save(existCartItem);
    } else {
        const newCartItem = cartItemRepository.create({
            cart: cart,
            product: existProduct,
            quantity: 1,
        });

        await cartItemRepository.save(newCartItem);
    }

    const updateCart = await cartRepository.findOne({
        where: {
            id: cart.id,
        },
        relations: {
            items: true,
        }
    })

    return res.status(200).json({ cart: updateCart })
}

export const removeFromCart = async (req: AuthRequest, res: Response) => {
    const { productId } = req.body;
    const user = req.user;

    // check user cart exist
    let cart = await cartRepository.findOne({
        where: {
            user: {
                id: user?.id,
            },
        },
        relations: {
            items: true,
        },
    });

    if (!cart) {
        return res.status(404).json({ message: "cart not found" })
    }

    const existProduct = await productRepository.findOne({
        where: {
            id: productId,
        }
    })

    if (!existProduct) {
        return res.status(404).json({ message: "product not found" })
    }

    const existProductItem = await cartItemRepository.findOne({
        where: {
            cart: cart,
            product: existProduct
        }
    })

    if (!existProductItem) {
        return res.status(404).json({ message: "product not found in cart" })
    }

    cartItemRepository.remove(existProductItem);
    return res.status(200).json({ message: "product removed from cart" })
}

export const decreaseOnce = async (req: AuthRequest, res: Response) => {
    const { productId } = req.body;
    const user = req.user;

    let cart = await cartRepository.findOne({
        where: {
            user: {
                id: user?.id,
            }
        },
        relations: {
            items: true,
        }
    });

    if (!cart) {
        return res.status(404).json({ message: "cart not found" })
    }

    const existProduct = await productRepository.findOne({
        where: {
            id: productId
        }
    });

    if (!existProduct) {
        return res.status(404).json({ message: "product not found" });
    }

    const existProductItem = await cartItemRepository.findOne({
        where: {
            cart: cart,
            product: existProduct
        }
    });

    if (!existProductItem) {
        return res.status(404).json({ message: "product not found in cart" })
    }

    existProductItem.quantity -= 1;
    if (existProductItem.quantity <= 0) {
        await cartItemRepository.remove(existProductItem);
    }

    await cartItemRepository.save(existProductItem);

    return res.status(200).json({ cart: cart })
}