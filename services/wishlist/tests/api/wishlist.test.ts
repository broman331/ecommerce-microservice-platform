import request from 'supertest';
import app from '../../src/app';

describe('Wishlist Service API', () => {
    // Unique ID per test suite run is fine, or randomize
    const userId = 'user-' + Date.now();

    describe('POST /wishlist/:userId/add', () => {
        it('should add to wishlist', async () => {
            const res = await request(app)
                .post(`/wishlist/${userId}/add`)
                .send({ productId: 'p1' });

            expect(res.status).toBe(200);
            expect(res.body.userId).toBe(userId);
            expect(res.body.products).toContain('p1');
        });

        it('should ignore duplicates', async () => {
            await request(app).post(`/wishlist/${userId}/add`).send({ productId: 'p1' });
            const res = await request(app).post(`/wishlist/${userId}/add`).send({ productId: 'p1' });
            // Assuming implementation uses Set or check
            const count = res.body.products.filter((p: string) => p === 'p1').length;
            expect(count).toBe(1);
        });
    });

    describe('GET /wishlist/:userId', () => {
        it('should return wishlist', async () => {
            const res = await request(app).get(`/wishlist/${userId}`);
            expect(res.status).toBe(200);
            expect(res.body.products).toContain('p1');
        });
    });

    describe('DELETE /wishlist/:userId/remove/:productId', () => {
        it('should remove product', async () => {
            const res = await request(app).delete(`/wishlist/${userId}/remove/p1`);
            expect(res.status).toBe(200);
            expect(res.body.products).not.toContain('p1');
        });
    });
});
