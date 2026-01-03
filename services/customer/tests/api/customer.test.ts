import request from 'supertest';
import app from '../../src/app';
import jwt from 'jsonwebtoken';
import { OrderGateway } from '../../src/services/orderGateway';
import { WishlistGateway } from '../../src/services/wishlistGateway';

// Mock the Gateways
jest.mock('../../src/services/orderGateway');
jest.mock('../../src/services/wishlistGateway');
jest.mock('jsonwebtoken');

describe('Customer API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /customers/my-orders', () => {
        it('should return 200 and orders when authorized', async () => {
            const token = 'valid-token';
            const userId = 'user-123';

            (jwt.verify as jest.Mock).mockReturnValue({ userId });
            const mockOrders = [{ id: 'order-1', total: 100 }];
            (OrderGateway.prototype.getOrdersForUser as jest.Mock).mockResolvedValue(mockOrders);

            const res = await request(app)
                .get('/customers/me/orders')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockOrders);
            expect(OrderGateway.prototype.getOrdersForUser).toHaveBeenCalledWith(userId, token);
        });

        it('should return 401 if missing token', async () => {
            const res = await request(app).get('/customers/me/orders');
            expect(res.status).toBe(401);
        });
    });

    // Add more tests for wishlist...
    describe('GET /customers/me/wishlist', () => {
        it('should return wishlist', async () => {
            const token = 'valid-token';
            const userId = 'user-123';
            (jwt.verify as jest.Mock).mockReturnValue({ userId });

            const mockWishlist = { userId, items: [] };
            (WishlistGateway.prototype.getWishlist as jest.Mock).mockResolvedValue(mockWishlist);

            const res = await request(app)
                .get('/customers/me/wishlist')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body).toEqual(mockWishlist);
        });
    });
});
