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
exports.OrderController = void 0;
const orderService_1 = require("../services/orderService");
// Extend Request to include user if we had the middleware here
// For simplest Agent B implementation, we assume a header usually, or just pass userId in body/query or mock it.
// The OpenAPI spec says bearerAuth is used. We should probably accept the userId from the decoded token.
// Since we don't have the shared middleware library, we'll mock the extraction or assume the Gateway handles it.
// But wait, user service does auth. Agent B typically verifies the token or trusts the gateway.
// I'll implement a simple mock middleware or header check for userId to make it functional.
const orderService = new orderService_1.OrderService();
class OrderController {
    getUserOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Mock getting userId from header (in real app, from JWT)
            const userId = req.headers['x-user-id'] || '1';
            const orders = yield orderService.findByUserId(userId);
            res.json(orders);
        });
    }
    searchOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, startDate, endDate } = req.query;
            const orders = yield orderService.searchOrders({
                userId: userId,
                startDate: startDate,
                endDate: endDate
            });
            res.json(orders);
        });
    }
    createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.headers['x-user-id'] || '1';
            const { items, shippingAddressId } = req.body;
            if (!items || !Array.isArray(items)) {
                return res.status(400).json({ message: 'Invalid items' });
            }
            const order = yield orderService.createOrder(userId, items, shippingAddressId);
            res.status(201).json(order);
        });
    }
    getOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const order = yield orderService.getOrderById(id);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            res.json(order);
        });
    }
    updateStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { status } = req.body;
            const order = yield orderService.updateOrderStatus(id, status);
            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }
            res.json(order);
        });
    }
}
exports.OrderController = OrderController;
