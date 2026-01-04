export interface WishlistItem {
    productId: string;
    addedAt: string;
}

export interface Wishlist {
    customerId: string; // Using customerId to match other services (instead of userId, though usually same)
    items: WishlistItem[];
}
