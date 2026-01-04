import axios from 'axios';
import { ICustomerRepository, CustomerProfile } from './ICustomerRepository';
import { OrderGateway } from '../services/orderGateway';
import { WishlistGateway } from '../services/wishlistGateway';

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';

export class AggregatorCustomerRepository implements ICustomerRepository {
    private orderGateway = new OrderGateway();
    private wishlistGateway = new WishlistGateway();

    async getProfile(userId: string): Promise<CustomerProfile | null> {
        try {
            // 1. Get User Profile
            const userRes = await axios.get(`${USER_SERVICE_URL}/users/${userId}`);
            const user = userRes.data;

            // 2. Get Orders (As Admin/System) - leveraging the gateway's logic (or mock token)
            // The gateway usually requires a token. We might mock it here for simplicity.
            const orders = await this.orderGateway.getOrdersForUser(userId, 'system-token');

            // 3. Get Wishlist
            const wishlist = await this.wishlistGateway.getWishlist(userId);

            return {
                ...user,
                orders,
                wishlist
            };
        } catch (e) {
            console.error("Failed to fetch customer profile", e);
            return null;
        }
    }

    async saveProfile(profile: CustomerProfile): Promise<CustomerProfile> {
        throw new Error("Aggregator Mode does not support direct Profile Saving. Update individual services.");
    }
}
