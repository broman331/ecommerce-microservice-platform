import axios from 'axios';
import { orders, Order, OrderItem } from '../models/Order';

const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL || 'http://localhost:3003';

export class OrderService {
    async findByUserId(userId: string): Promise<Order[]> {
        return orders.filter(o => o.userId === userId);
    }

    async searchOrders(filters: { userId?: string, startDate?: string, endDate?: string }): Promise<Order[]> {
        return orders.filter(o => {
            if (filters.userId && o.userId !== filters.userId) return false;
            if (filters.startDate && new Date(o.createdAt) < new Date(filters.startDate)) return false;
            if (filters.endDate && new Date(o.createdAt) > new Date(filters.endDate)) return false;
            return true;
        });
    }

    async createOrder(userId: string, items: { productId: string; quantity: number }[], shippingAddressId?: string): Promise<Order> {
        // In a real microservice architecture, we would:
        // 1. Call Inventory Service -> Check stock & Get price
        // 2. Call User Service -> Validate User (if not done via token)

        // For this mock implementation, we'll assign a static price.
        const orderItems: OrderItem[] = items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: 100 // Mock price
        }));

        // Deduct Stock via Inventory Service
        for (const item of items) {
            try {
                // Call /products/:id/deduct
                // Ensure endpoint is correct based on what we added to Inventory Service
                await axios.post(`${INVENTORY_SERVICE_URL}/products/${item.productId}/deduct`, {
                    quantity: item.quantity
                });
            } catch (error) {
                console.error(`Failed to deduct stock for product ${item.productId}`, error);
                // In a real system, we'd rollback or fail the order. 
                // Here we proceed but log it.
            }
        }

        const totalAmount = orderItems.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity), 0);

        const newOrder: Order = {
            id: `order-${orders.length + 1}`,
            userId,
            status: 'PENDING',
            totalAmount,
            items: orderItems,
            createdAt: new Date().toISOString(),
            shippingAddressId
        };

        orders.push(newOrder);
        return newOrder;
    }
    async getOrderById(id: string): Promise<Order | undefined> {
        return orders.find(o => o.id === id);
    }

    async updateOrderStatus(id: string, status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED'): Promise<Order | null> {
        const order = orders.find(o => o.id === id);
        if (!order) return null;
        order.status = status;
        return order;
    }
}
