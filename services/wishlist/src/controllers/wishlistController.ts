import { Request, Response } from 'express';
import { WishlistModel } from '../models/wishlistModel';

export class WishlistController {
    getWishlist(req: Request, res: Response) {
        const { userId } = req.params;
        const products = WishlistModel.get(userId);
        res.json({ userId, products });
    }

    addToWishlist(req: Request, res: Response) {
        const { userId } = req.params;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: 'ProductId is required' });
        }

        const products = WishlistModel.add(userId, productId);
        res.json({ userId, products });
    }

    removeFromWishlist(req: Request, res: Response) {
        const { userId, productId } = req.params;
        const products = WishlistModel.remove(userId, productId);
        res.json({ userId, products });
    }
}
