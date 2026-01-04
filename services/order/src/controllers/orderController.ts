import { Request, Response } from 'express';
import { OrderService } from '../services/orderService';

// Extend Request to include user if we had the middleware here
// For simplest Agent B implementation, we assume a header usually, or just pass userId in body/query or mock it.
// The OpenAPI spec says bearerAuth is used. We should probably accept the userId from the decoded token.
// Since we don't have the shared middleware library, we'll mock the extraction or assume the Gateway handles it.
// But wait, user service does auth. Agent B typically verifies the token or trusts the gateway.
// I'll implement a simple mock middleware or header check for userId to make it functional.

import { MemoryOrderRepository } from '../dal/MemoryOrderRepository';
import { DynamoOrderRepository } from '../dal/DynamoOrderRepository';
import { FirestoreOrderRepository } from '../dal/FirestoreOrderRepository';
import { IOrderRepository } from '../dal/IOrderRepository';

let orderRepository: IOrderRepository;

switch (process.env.DB_PROVIDER) {
    case 'dynamodb':
        orderRepository = new DynamoOrderRepository();
        break;
    case 'firestore':
        orderRepository = new FirestoreOrderRepository();
        break;
    default:
        orderRepository = new MemoryOrderRepository();
}

const orderService = new OrderService(orderRepository);

export class OrderController {
    async getUserOrders(req: Request, res: Response) {
        // Mock getting userId from header (in real app, from JWT)
        const userId = req.headers['x-user-id'] as string || '1';
        const orders = await orderService.findByUserId(userId);
        res.json(orders);
    }

    async searchOrders(req: Request, res: Response) {
        const { userId, startDate, endDate } = req.query;
        const orders = await orderService.searchOrders({
            userId: userId as string,
            startDate: startDate as string,
            endDate: endDate as string
        });
        res.json(orders);
    }

    async createOrder(req: Request, res: Response) {
        const userId = req.headers['x-user-id'] as string || '1';
        const { items, shippingAddressId } = req.body;

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ message: 'Invalid items' });
        }

        const order = await orderService.createOrder(userId, items, shippingAddressId);
        res.status(201).json(order);
    }
    async getOrder(req: Request, res: Response) {
        const { id } = req.params;
        const order = await orderService.getOrderById(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    }

    async updateStatus(req: Request, res: Response) {
        const { id } = req.params;
        const { status } = req.body;

        const order = await orderService.updateOrderStatus(id, status);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    }
}
