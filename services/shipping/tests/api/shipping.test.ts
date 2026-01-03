import request from 'supertest';
import app from '../../src/app';

describe('Shipping Service API', () => {
    const userId = 'user-' + Date.now();

    describe('POST /shipping/:userId/addresses', () => {
        it('should add address', async () => {
            const res = await request(app).post(`/shipping/${userId}/addresses`).send({
                streetAddress: '123 Test St',
                city: 'Test City',
                zip: '12345'
            });

            expect(res.status).toBe(201);
            expect(res.body.id).toBeDefined();
        });
    });

    describe('GET /shipping/:userId/addresses', () => {
        it('should return addresses', async () => {
            // Add one
            await request(app).post(`/shipping/${userId}/addresses`).send({
                streetAddress: '123 Test St',
                city: 'Test City',
                zip: '12345'
            });

            const res = await request(app).get(`/shipping/${userId}/addresses`);
            expect(res.status).toBe(200);
            expect(res.body.length).toBeGreaterThan(0);
        });
    });

    describe('POST /shipping/dispatch', () => {
        it('should dispatch order', async () => {
            const res = await request(app).post('/shipping/dispatch').send({
                orderId: 'order-123',
                userId,
                items: [{ id: '1' }]
            });
            expect(res.status).toBe(201);
            expect(res.body.trackingNumber).toBeDefined();
        });
    });
});
