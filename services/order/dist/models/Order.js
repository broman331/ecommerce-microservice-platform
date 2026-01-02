"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orders = void 0;
// Mock Database
exports.orders = [
    {
        id: 'order-1',
        userId: '1',
        status: 'CONFIRMED',
        totalAmount: 1250,
        items: [
            { productId: '1', quantity: 1, priceAtPurchase: 1200 },
            { productId: '2', quantity: 2, priceAtPurchase: 25 }
        ],
        createdAt: new Date().toISOString()
    }
];
