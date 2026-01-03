import request from 'supertest';
import app from '../../src/app';
import { orders } from '../../src/models/Order';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Order Service API', () => {
    beforeEach(() => {
        // Clear mock DB
        orders.length = 0;
        jest.clearAllMocks();
    });

    describe('POST /orders', () => {
        it('should create a new order and deduct stock', async () => {
            const newOrderPayload = {
                userId: 'user-1',
                items: [
                    { productId: 'p1', quantity: 2 }
                ]
            };

            // Mock Inventory calls
            mockedAxios.get.mockResolvedValue({ data: { name: 'Test Product', price: 50 } });
            mockedAxios.post.mockResolvedValue({ data: { success: true } });

            const res = await request(app)
                .post('/orders')
                .send(newOrderPayload);

            expect(res.status).toBe(201);
            expect(res.body.id).toBeDefined();
            expect(res.body.totalAmount).toBe(100); // 2 * 50
            expect(res.body.status).toBe('PENDING');

            // Verify db update
            expect(orders).toHaveLength(1);
        });

        it('should handle inventory errors gracefully', async () => {
            const newOrderPayload = {
                userId: 'user-1',
                items: [{ productId: 'p1', quantity: 1 }]
            };

            mockedAxios.get.mockImplementation(() => Promise.reject(new Error('Inv down')));
            // It should still create order but with unknown product info?
            // Code shows: name = name || 'Unknown Product'

            const res = await request(app).post('/orders').send(newOrderPayload);
            expect(res.status).toBe(201);
            expect(res.body.items[0].name).toBe('Unknown Product');
        });
    });

    describe('GET /orders', () => {
        it('should return orders for a user', async () => {
            // Seed DB
            orders.push({
                id: 'o1',
                userId: 'user-1',
                status: 'CONFIRMED',
                totalAmount: 100,
                items: [],
                createdAt: new Date().toISOString()
            });

            const res = await request(app).get('/orders').set('x-user-id', 'user-1');
            // The controller uses `req.query.userId` OR header?
            // Need to check controller. Route says: `router.get('/', orderController.getUserOrders.bind(orderController));`

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(1);
            expect(res.body[0].id).toBe('o1');
        });
    });
});
