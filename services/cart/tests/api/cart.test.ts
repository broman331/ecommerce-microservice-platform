import request from 'supertest';
import app from '../../src/app';
import { IntegrationService } from '../../src/services/integrationService';

jest.mock('../../src/services/integrationService');

describe('Cart Service API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Strategy: We can't easily clear the "private carts" map because it's in a singleton controller instance 
    // initialized in routes file.
    // Ideally we'd modify the code to be more testable, but for now we'll rely on using unique customer IDs 
    // or clearing the cart via API at start of test.

    const customerId = 'test-customer-1';

    // Helper to ensure clean slate
    const clearCart = async () => request(app).delete(`/cart/${customerId}`);

    describe('POST /cart/:customerId/items', () => {
        beforeEach(async () => {
            await clearCart();
        });

        it('should add item to cart', async () => {
            // Mock IntegrationService responses
            (IntegrationService.prototype.getProductDetails as jest.Mock).mockResolvedValue({
                id: 'p1', price: 10, name: 'Product 1', image: 'img.jpg'
            });
            (IntegrationService.prototype.checkInventory as jest.Mock).mockResolvedValue(100);

            const res = await request(app)
                .post(`/cart/${customerId}/items`)
                .send({ productId: 'p1', quantity: 2 });

            expect(res.status).toBe(200);
            expect(res.body.items).toHaveLength(1);
            expect(res.body.items[0].quantity).toBe(2);
            expect(res.body.totalPrice).toBe(20);
        });

        it('should fail if insuficient stock', async () => {
            (IntegrationService.prototype.getProductDetails as jest.Mock).mockResolvedValue({
                id: 'p1', price: 10, name: 'P1'
            });
            (IntegrationService.prototype.checkInventory as jest.Mock).mockResolvedValue(1); // Only 1 in stock

            const res = await request(app)
                .post(`/cart/${customerId}/items`)
                .send({ productId: 'p1', quantity: 2 });

            expect(res.status).toBe(400);
            expect(res.body.error).toMatch(/start|sufficient|stock/i);
        });
    });

    describe('POST /cart/:customerId/checkout', () => {
        beforeEach(async () => {
            await clearCart();
            // Add item first
            (IntegrationService.prototype.getProductDetails as jest.Mock).mockResolvedValue({
                id: 'p1', price: 10, name: 'Product 1', image: 'img.jpg'
            });
            (IntegrationService.prototype.checkInventory as jest.Mock).mockResolvedValue(100);
            await request(app).post(`/cart/${customerId}/items`).send({ productId: 'p1', quantity: 1 });
        });

        it('should checkout successfully', async () => {
            (IntegrationService.prototype.createOrder as jest.Mock).mockResolvedValue({
                id: 'order-1', status: 'PENDING'
            });

            const res = await request(app).post(`/cart/${customerId}/checkout`);
            expect(res.status).toBe(201);
            expect(res.body.id).toBe('order-1');
        });
    });
});
