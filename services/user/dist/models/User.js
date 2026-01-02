"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
// Mock Database
exports.users = [
    {
        id: '1',
        email: 'test@example.com',
        // password is 'password123'
        passwordHash: '$2a$10$YourHashedPasswordHerePlaceholderForSimplicity',
        name: 'Test User',
        createdAt: new Date().toISOString()
    }
];
