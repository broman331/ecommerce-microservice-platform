import { IWishlistRepository } from './IWishlistRepository';
import { Wishlist } from '../models/Wishlist';

export class MemoryWishlistRepository implements IWishlistRepository {
    private wishlists: Map<string, Wishlist> = new Map();

    async findByCustomerId(customerId: string): Promise<Wishlist | undefined> {
        return this.wishlists.get(customerId);
    }

    async save(wishlist: Wishlist): Promise<Wishlist> {
        this.wishlists.set(wishlist.customerId, wishlist);
        return wishlist;
    }
}
