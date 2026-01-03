import request from 'supertest';
import app from '../../src/app';
import { products } from '../../src/models/Product';

describe('Inventory Service API', () => {
    beforeEach(() => {
        products.length = 0;
    });

    describe('POST /products', () => {
        it('should create product', async () => {
            const res = await request(app).post('/products').send({
                name: 'Test Item',
                price: 10,
                stock: 100
            });
            expect(res.status).toBe(201);
            expect(res.body.id).toBeDefined();
            expect(products).toHaveLength(1);
        });
    });

    describe('GET /products/:id', () => {
        it('should return product', async () => {
            products.push({ id: 'p1', name: 'P1', price: 10, stock: 10, enabled: true, description: '' });
            const res = await request(app).get('/products/p1');
            expect(res.status).toBe(200);
            expect(res.body.id).toBe('p1');
        });

        it('should return 404', async () => {
            const res = await request(app).get('/products/unknown');
            expect(res.status).toBe(404);
        });
    });

    describe('POST /products/:id/deduct', () => {
        it('should deduct stock', async () => {
            products.push({ id: 'p1', name: 'P1', price: 10, stock: 10, enabled: true, description: '' });

            const res = await request(app).post('/products/p1/deduct').send({ quantity: 5 });
            expect(res.status).toBe(200);
            expect(products[0].stock).toBe(5);
        });

        it('should fail if insufficient stock', async () => {
            products.push({ id: 'p1', name: 'P1', price: 10, stock: 1, enabled: true, description: '' });

            const res = await request(app).post('/products/p1/deduct').send({ quantity: 5 });
            expect(res.status).toBe(400);
            // Assuming 400 for bad request. Need to verify controller? 
            // Usually standard practice.
        });
    });
});
