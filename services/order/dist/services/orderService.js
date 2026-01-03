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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const axios_1 = __importDefault(require("axios"));
const Order_1 = require("../models/Order");
const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL || 'http://localhost:3003';
class OrderService {
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return Order_1.orders.filter(o => o.userId === userId);
        });
    }
    searchOrders(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            return Order_1.orders.filter(o => {
                if (filters.userId && o.userId !== filters.userId)
                    return false;
                if (filters.startDate && new Date(o.createdAt) < new Date(filters.startDate))
                    return false;
                if (filters.endDate && new Date(o.createdAt) > new Date(filters.endDate))
                    return false;
                return true;
            });
        });
    }
    createOrder(userId, items, shippingAddressId) {
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
            // Deduct Stock via Inventory Service
            for (const item of items) {
                try {
                    // Call /products/:id/deduct
                    // Ensure endpoint is correct based on what we added to Inventory Service
                    yield axios_1.default.post(`${INVENTORY_SERVICE_URL}/products/${item.productId}/deduct`, {
                        quantity: item.quantity
                    });
                }
                catch (error) {
                    console.error(`Failed to deduct stock for product ${item.productId}`, error);
                    // In a real system, we'd rollback or fail the order. 
                    // Here we proceed but log it.
                }
            }
            const totalAmount = orderItems.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity), 0);
            const newOrder = {
                id: `order-${Order_1.orders.length + 1}`,
                userId,
                status: 'PENDING',
                totalAmount,
                items: orderItems,
                createdAt: new Date().toISOString(),
                shippingAddressId
            };
            Order_1.orders.push(newOrder);
            return newOrder;
        });
    }
    getOrderById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return Order_1.orders.find(o => o.id === id);
        });
    }
    updateOrderStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = Order_1.orders.find(o => o.id === id);
            if (!order)
                return null;
            order.status = status;
            return order;
        });
    }
}
exports.OrderService = OrderService;
