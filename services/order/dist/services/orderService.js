"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const Order_1 = require("../models/Order");
class OrderService {
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Order_1.orders.filter(o => o.userId === userId);
        });
    }
    createOrder(userId, items) {
        return __awaiter(this, void 0, void 0, function* () {
            // In a real microservice architecture, we would:
            // 1. Call Inventory Service -> Check stock & Get price
            // 2. Call User Service -> Validate User (if not done via token)
            // For this mock implementation, we'll assign a static price.
            const orderItems = items.map(item => ({
                productId: item.productId,
                quantity: item.quantity,
                priceAtPurchase: 100 // Mock price
            }));
            const totalAmount = orderItems.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity), 0);
            const newOrder = {
                id: `order-${Order_1.orders.length + 1}`,
                userId,
                status: 'PENDING',
                totalAmount,
                items: orderItems,
                createdAt: new Date().toISOString()
            };
            Order_1.orders.push(newOrder);
            return newOrder;
        });
    }
}
exports.OrderService = OrderService;
