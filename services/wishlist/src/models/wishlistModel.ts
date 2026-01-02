
// Simple in-memory storage: Map<userId, WishlistItem[]>
export interface WishlistItem {
    productId: string;
    addedAt: string;
}

const wishlistStorage = new Map<string, WishlistItem[]>();

// Populate Mock Data
const generateMockData = () => {
    for (let i = 1; i <= 10; i++) {
        const userId = i.toString();
        const items: WishlistItem[] = [];
        const numItems = Math.floor(Math.random() * 3) + 3; // 3 to 5 items
        for (let j = 0; j < numItems; j++) {
            items.push({
                productId: Math.floor(Math.random() * 20 + 1).toString(),
                addedAt: new Date().toISOString()
            });
        }
        wishlistStorage.set(userId, items);
    }
};

generateMockData();

export class WishlistModel {
    static get(userId: string): WishlistItem[] {
        return wishlistStorage.get(userId) || [];
    }

    static add(userId: string, productId: string): WishlistItem[] {
        if (!wishlistStorage.has(userId)) {
            wishlistStorage.set(userId, []);
        }
        const items = wishlistStorage.get(userId)!;
        // Avoid duplicates
        if (!items.find(i => i.productId === productId)) {
            items.push({ productId, addedAt: new Date().toISOString() });
        }
        return items;
    }

    static remove(userId: string, productId: string): WishlistItem[] {
        if (wishlistStorage.has(userId)) {
            const items = wishlistStorage.get(userId)!;
            const filtered = items.filter(i => i.productId !== productId);
            wishlistStorage.set(userId, filtered);
            return filtered;
        }
        return [];
    }
}
