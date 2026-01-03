import request from 'supertest';
import app from '../../src/app';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Product Service API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /store/products', () => {
        it('should return enriched products', async () => {
            // Mock Inventory Response
            const mockProducts = [
                { id: 'p1', name: 'Product 1', price: 10, stock: 5, enabled: true },
                { id: 'p2', name: 'Product 2', price: 20, stock: 0, enabled: true }
            ];
            mockedAxios.get.mockImplementation((url) => {
                if (url.includes('/products')) return Promise.resolve({ data: mockProducts });
                if (url.includes('/orders')) return Promise.resolve({ data: [] }); // 0 orders
                return Promise.reject(new Error('Unknown url'));
            });

            const res = await request(app).get('/store/products');

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
            expect(res.body[0]).toHaveProperty('totalOrders', 0);
        });

        it('should calculate order stats correctly', async () => {
            const mockProducts = [{ id: 'p1', name: 'Product 1' }];
            const mockOrders = [
                {
                    id: 'o1',
                    createdAt: '2025-01-01T10:00:00Z',
                    items: [{ productId: 'p1', quantity: 1 }]
                }
            ];

            mockedAxios.get.mockImplementation((url) => {
                if (url.endsWith('/products')) return Promise.resolve({ data: mockProducts });
                if (url.includes('/orders')) return Promise.resolve({ data: mockOrders });
                return Promise.reject(new Error('Unknown url'));
            });

            const res = await request(app).get('/store/products');
            expect(res.body[0].totalOrders).toBe(1);
            expect(res.body[0].lastOrderedAt).toBe('2025-01-01T10:00:00Z');
        });
    });

    describe('GET /store/products/:id', () => {
        it('should return enriched product detail', async () => {
            mockedAxios.get.mockImplementation((url) => {
                if (url.includes('/products/p1')) return Promise.resolve({ data: { id: 'p1', name: 'P1' } });
                if (url.includes('/orders')) return Promise.resolve({ data: [] });
                return Promise.reject(new Error('Not found'));
            });

            const res = await request(app).get('/store/products/p1');
            expect(res.status).toBe(200);
            expect(res.body.id).toBe('p1');
        });

        it('should return 404 if not found in inventory', async () => {
            mockedAxios.get.mockRejectedValue(new Error('Not Found'));
            const res = await request(app).get('/store/products/unknown');
            expect(res.status).toBe(404); // Controller returns 404 on null/error from service?
            // Actually AggregatorService returns null on catch, Controller checks if (!product) return 404.
            // Wait, AggregatorService.getEnrichedProduct returns null if catch(e).
            // So if axios throws, service returns null -> 404. Correct.
        });
    });
});
