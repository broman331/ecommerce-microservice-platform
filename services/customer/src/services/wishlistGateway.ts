import axios from 'axios';

const WISHLIST_SERVICE_URL = process.env.WISHLIST_SERVICE_URL || 'http://localhost:3006';

export class WishlistGateway {
    async getWishlist(userId: string) {
        try {
            const response = await axios.get(`${WISHLIST_SERVICE_URL}/wishlist/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Failed to fetch wishlist", error);
            // Return empty wishlist on failure to maintain resilience
            return { userId, products: [] };
        }
    }

    async addToWishlist(userId: string, productId: string) {
        try {
            const response = await axios.post(`${WISHLIST_SERVICE_URL}/wishlist/${userId}/add`, { productId });
            return response.data;
        } catch (error) {
            console.error("Failed to add to wishlist", error);
            throw error;
        }
    }

    async removeFromWishlist(userId: string, productId: string) {
        try {
            const response = await axios.delete(`${WISHLIST_SERVICE_URL}/wishlist/${userId}/remove/${productId}`);
            return response.data;
        } catch (error) {
            console.error("Failed to remove from wishlist", error);
            throw error;
        }
    }
}
