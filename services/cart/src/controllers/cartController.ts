import { Request, Response } from 'express';
import { CartService } from '../services/cartService';
import { MemoryCartRepository } from '../dal/MemoryCartRepository';
import { DynamoCartRepository } from '../dal/DynamoCartRepository';
import { FirestoreCartRepository } from '../dal/FirestoreCartRepository';
import { ICartRepository } from '../dal/ICartRepository';

let cartRepository: ICartRepository;

switch (process.env.DB_PROVIDER) {
    case 'dynamodb':
        cartRepository = new DynamoCartRepository();
        break;
    case 'firestore':
        cartRepository = new FirestoreCartRepository();
        break;
    default:
        cartRepository = new MemoryCartRepository();
}

const cartService = new CartService(cartRepository);

export class CartController {

    constructor() {
        // No local state init needed
    }

    getCart = async (req: Request, res: Response): Promise<void> => {
        const { customerId } = req.params;
        const cart = await cartService.getCart(customerId);
        res.json(cart);
    }

    getAllCarts = async (req: Request, res: Response): Promise<void> => {
        // Not implemented in Repo for optimization reasons in expanded envs
        // Or we could implement scan. For now, returning empty or not supported.
        res.status(501).json({ message: "Not supported in this version" });
    }

    addToCart = async (req: Request, res: Response): Promise<void> => {
        const { customerId } = req.params;
        const { productId, quantity } = req.body;

        if (!productId || !quantity || quantity <= 0) {
            res.status(400).json({ error: 'Invalid product ID or quantity' });
            return;
        }

        const result = await cartService.addToCart(customerId, productId, quantity);
        if (!result.success) {
            res.status(400).json({ error: result.error });
            return;
        }
        res.json(result.cart);
    }

    updateCartItem = async (req: Request, res: Response): Promise<void> => {
        const { customerId, productId } = req.params;
        const { quantity } = req.body;

        const result = await cartService.updateCartItem(customerId, productId, quantity);
        if (!result.success) {
            res.status(result.error === 'Cart not found' ? 404 : 400).json({ error: result.error });
            return;
        }
        res.json(result.cart);
    }

    removeFromCart = async (req: Request, res: Response): Promise<void> => {
        const { customerId, productId } = req.params;
        const result = await cartService.removeFromCart(customerId, productId);
        if (!result.success) {
            res.status(404).json({ error: result.error });
            return;
        }
        res.json(result.cart);
    }

    clearCart = async (req: Request, res: Response): Promise<void> => {
        const { customerId } = req.params;
        await cartService.clearCart(customerId);
        res.status(204).send();
    }

    updateShippingAddress = async (req: Request, res: Response): Promise<void> => {
        const { customerId } = req.params;
        const { addressId } = req.body;

        const cart = await cartService.updateShippingAddress(customerId, addressId);
        if (!cart) {
            res.status(404).json({ error: 'Cart not found' });
            return;
        }
        res.json(cart);
    }

    checkout = async (req: Request, res: Response): Promise<void> => {
        const { customerId } = req.params;
        const result = await cartService.checkout(customerId);
        if (!result.success) {
            res.status(result.error === 'Failed to create order' ? 500 : 400).json({ error: result.error });
            return;
        }
        res.status(201).json(result.order);
    }

    applyPromotion = async (req: Request, res: Response): Promise<void> => {
        const { customerId } = req.params;
        const { code } = req.body;

        const result = await cartService.validateAndApplyPromotion(customerId, code);
        if (!result.success) {
            res.status(result.error === 'Cart not found' ? 404 : 400).json({ error: result.error });
            return;
        }
        res.json(result.cart);
    }
}

