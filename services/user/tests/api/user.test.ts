import request from 'supertest';
import app from '../../src/app';
import { users } from '../../src/models/User';

describe('User Service API', () => {
    beforeEach(() => {
        users.length = 0;
    });

    describe('POST /auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(app).post('/auth/register').send({
                email: 'new@test.com',
                password: 'password123',
                name: 'New User'
            });

            expect(res.status).toBe(201);
            expect(res.body.user.email).toBe('new@test.com');
            expect(users).toHaveLength(1);
        });

        it('should fail if email exists', async () => {
            // Seed
            users.push({ id: '1', email: 'existing@test.com', name: 'Existing', passwordHash: 'hash', createdAt: '' });

            const res = await request(app).post('/auth/register').send({
                email: 'existing@test.com',
                password: 'pwd',
                name: 'A'
            });
            expect(res.status).toBe(400); // Assuming 400
        });
    });

    describe('POST /auth/login', () => {
        it('should login successfully', async () => {
            // Register first to get a hashed password that works
            await request(app).post('/auth/register').send({
                email: 'login@test.com',
                password: 'password123',
                name: 'Login User'
            });

            const res = await request(app).post('/auth/login').send({
                email: 'login@test.com',
                password: 'password123'
            });

            expect(res.status).toBe(200);
            expect(res.body.token).toBeDefined();
        });
    });

    describe('GET /users/profile', () => {
        it('should return profile', async () => {
            // Register and login to get token
            await request(app).post('/auth/register').send({
                email: 'me@test.com',
                password: 'pwd',
                name: 'Me'
            });
            const loginRes = await request(app).post('/auth/login').send({
                email: 'me@test.com',
                password: 'pwd'
            });
            const token = loginRes.body.token;

            const res = await request(app)
                .get('/users/profile')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.email).toBe('me@test.com');
        });
    });
});
