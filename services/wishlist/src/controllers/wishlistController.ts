import { Request, Response } from 'express';
import { WishlistService } from '../services/wishlistService';
import { MemoryWishlistRepository } from '../dal/MemoryWishlistRepository';
import { DynamoWishlistRepository } from '../dal/DynamoWishlistRepository';
import { FirestoreWishlistRepository } from '../dal/FirestoreWishlistRepository';
import { IWishlistRepository } from '../dal/IWishlistRepository';

let wishlistRepository: IWishlistRepository;

switch (process.env.DB_PROVIDER) {
    case 'dynamodb':
        wishlistRepository = new DynamoWishlistRepository();
        break;
    case 'firestore':
        wishlistRepository = new FirestoreWishlistRepository();
        break;
    default:
        wishlistRepository = new MemoryWishlistRepository();
}

const wishlistService = new WishlistService(wishlistRepository);

export class WishlistController {
    getWishlist = async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.params;
        const products = await wishlistService.getWishlist(userId);
        res.json({ userId, products });
    }

    addToWishlist = async (req: Request, res: Response): Promise<void> => {
        const { userId } = req.params;
        const { productId } = req.body;

        if (!productId) {
            res.status(400).json({ message: 'ProductId is required' });
            return;
        }

        const products = await wishlistService.addToWishlist(userId, productId);
        res.json({ userId, products });
    }

    removeFromWishlist = async (req: Request, res: Response): Promise<void> => {
        const { userId, productId } = req.params;
        const products = await wishlistService.removeFromWishlist(userId, productId);
        res.json({ userId, products });
    }
}

