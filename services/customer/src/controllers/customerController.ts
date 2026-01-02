import { Request, Response } from 'express';
import { OrderGateway } from '../services/orderGateway';
import { WishlistGateway } from '../services/wishlistGateway';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const orderGateway = new OrderGateway();
const wishlistGateway = new WishlistGateway();

// Cheap hack: In a real system we'd share the secret via env vars.
// Assuming "secret" from User Service (Agent A).
const JWT_SECRET = 'secret';
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3001';

export class CustomerController {
    async getMyOrders(req: Request, res: Response) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            const userId = decoded.userId; // Agent A signs with { userId: ... }

            if (!userId) {
                return res.status(401).json({ message: 'Invalid token payload' });
            }

            const orders = await orderGateway.getOrdersForUser(userId, token);
            res.json(orders);

        } catch (err) {
            console.error("Token verification failed", err);
            return res.status(401).json({ message: 'Invalid token' });
        }
    }

    async getMyWishlist(req: Request, res: Response) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            const userId = decoded.userId;

            if (!userId) {
                return res.status(401).json({ message: 'Invalid token payload' });
            }

            const wishlist = await wishlistGateway.getWishlist(userId);
            res.json(wishlist);

        } catch (err) {
            console.error("Token verification failed", err);
            return res.status(401).json({ message: 'Invalid token' });
        }
    }

    async addToMyWishlist(req: Request, res: Response) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            const userId = decoded.userId;
            if (!userId) {
                return res.status(401).json({ message: 'Invalid token payload' });
            }

            const { productId } = req.body;
            if (!productId) {
                return res.status(400).json({ message: 'ProductId is required' });
            }

            const result = await wishlistGateway.addToWishlist(userId, productId);
            res.json(result);
        } catch (err) {
            console.error("Add to wishlist failed", err);
            return res.status(500).json({ message: 'Failed to add to wishlist' });
        }
    }

    async removeFromMyWishlist(req: Request, res: Response) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, JWT_SECRET) as any;
            const userId = decoded.userId;
            const { productId } = req.params;

            const result = await wishlistGateway.removeFromWishlist(userId, productId);
            res.json(result);
        } catch (err) {
            console.error("Remove from wishlist failed", err);
            return res.status(500).json({ message: 'Failed to remove from wishlist' });
        }
    }




    // Admin: Get All Customers (Proxy User Service)
    async getAllCustomers(req: Request, res: Response) {
        // Call User Service
        try {
            const response = await axios.get(`${USER_SERVICE_URL}/users`);
            res.json(response.data);
        } catch (e) {
            console.error(e);
            res.status(500).json({ message: 'Failed to fetch customers' });
        }
    }

    // Admin: Get Customer Details + Orders + Wishlist
    async getCustomerDetails(req: Request, res: Response) {
        const { id } = req.params;
        try {
            // 1. Get User Profile
            const userRes = await axios.get(`${USER_SERVICE_URL}/users/${id}`);
            const user = userRes.data;

            // 2. Get Orders (As Admin/System)
            const orders = await orderGateway.getOrdersForUser(id, 'system-token');

            // 3. Get Wishlist
            const wishlist = await wishlistGateway.getWishlist(id);

            res.json({
                ...user,
                orders,
                wishlist
            });

        } catch (e) {
            console.error(e);
            res.status(404).json({ message: 'Customer or data not found' });
        }
    }

    // Admin: Search Orders (Global)
    async searchOrders(req: Request, res: Response) {
        const { userId, period } = req.query;
        let startDate: string | undefined;
        const now = new Date();

        if (period === 'last_day') {
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
        } else if (period === 'last_week') {
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        } else if (period === 'last_month') {
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
        } else if (period === 'last_year') {
            startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();
        }

        const orders = await orderGateway.searchOrders({
            userId: userId as string,
            startDate
        });
        res.json(orders);
    }
}
