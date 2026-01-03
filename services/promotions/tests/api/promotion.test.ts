import request from 'supertest';
import app from '../../src/app';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Promotions Service API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /promotions', () => {
        it('should return default promotions', async () => {
            const res = await request(app).get('/promotions');
            expect(res.status).toBe(200);
            expect(res.body.some((p: any) => p.code === 'SAVE10')).toBe(true);
        });
    });

    describe('POST /promotions', () => {
        it('should create promotion', async () => {
            const res = await request(app).post('/promotions').send({
                code: 'NEWPROMO',
                type: 'PERCENTAGE',
                value: 5
            });
            expect(res.status).toBe(201);
            expect(res.body.code).toBe('NEWPROMO');
        });
    });

    describe('POST /promotions/apply', () => {
        it('should apply promotion to valid cart', async () => {
            mockedAxios.get.mockResolvedValue({
                data: { totalPrice: 100, items: [{}] }
            });

            const res = await request(app).post('/promotions/apply').send({
                customerId: 'user-1',
                couponCode: 'SAVE10'
            });

            expect(res.status).toBe(200);
            expect(res.body.valid).toBe(true);
            expect(res.body.discount).toBe(10); // 10% of 100
            expect(res.body.finalTotal).toBe(90);
        });

        it('should fail if coupon invalid', async () => {
            mockedAxios.get.mockResolvedValue({
                data: { totalPrice: 100, items: [{}] }
            });
            const res = await request(app).post('/promotions/apply').send({
                customerId: 'user-1',
                couponCode: 'INVALID'
            });
            expect(res.status).toBe(400);
        });
    });
});
