import { IWishlistRepository } from '../dal/IWishlistRepository';
import { Wishlist, WishlistItem } from '../models/Wishlist';

export class WishlistService {
    constructor(private repository: IWishlistRepository) {
        // Init mock logic if needed? 
        // Existing model had mock data generation. 
        // For now, we will assume empty or strictly persistent.
    }

    async getWishlist(customerId: string): Promise<WishlistItem[]> {
        const wishlist = await this.repository.findByCustomerId(customerId);
        return wishlist ? wishlist.items : [];
    }

    async addToWishlist(customerId: string, productId: string): Promise<WishlistItem[]> {
        let wishlist = await this.repository.findByCustomerId(customerId);
        if (!wishlist) {
            wishlist = { customerId, items: [] };
        }

        // Avoid duplicates
        if (!wishlist.items.find(i => i.productId === productId)) {
            wishlist.items.push({ productId, addedAt: new Date().toISOString() });
        }

        await this.repository.save(wishlist);
        return wishlist.items;
    }

    async removeFromWishlist(customerId: string, productId: string): Promise<WishlistItem[]> {
        const wishlist = await this.repository.findByCustomerId(customerId);
        if (wishlist) {
            wishlist.items = wishlist.items.filter(i => i.productId !== productId);
            await this.repository.save(wishlist);
            return wishlist.items;
        }
        return [];
    }
}
