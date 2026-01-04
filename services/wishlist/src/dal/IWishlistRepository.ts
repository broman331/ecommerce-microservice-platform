import { Wishlist } from '../models/Wishlist';

export interface IWishlistRepository {
    findByCustomerId(customerId: string): Promise<Wishlist | undefined>;
    save(wishlist: Wishlist): Promise<Wishlist>;
}
