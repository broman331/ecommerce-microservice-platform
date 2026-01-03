import axios from 'axios';
import { orders, Order, OrderItem } from '../models/Order';

const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL || 'http://localhost:3003/products';

export class OrderService {
    private async enrichOrder(order: Order): Promise<Order> {
        for (const item of order.items) {
            if (!item.productName || !item.name) {
                try {
                    const res = await axios.get(`${INVENTORY_SERVICE_URL}/${item.productId}`);
                    const productName = res.data.name;
                    item.productName = productName;
                    item.name = productName;
                } catch (e: any) {
                    console.error(`Failed to enrich order item ${item.productId} at ${INVENTORY_SERVICE_URL}/${item.productId}`, e.message);
                }
            }
        }
        return order;
    }

    async findByUserId(userId: string): Promise<Order[]> {
        const userOrders = orders.filter(o => o.userId === userId);
        return Promise.all(userOrders.map(o => this.enrichOrder(o)));
    }

    async searchOrders(filters: { userId?: string, startDate?: string, endDate?: string }): Promise<Order[]> {
        const filtered = orders.filter(o => {
            if (filters.userId && o.userId !== filters.userId) return false;
            if (filters.startDate && new Date(o.createdAt) < new Date(filters.startDate)) return false;
            if (filters.endDate && new Date(o.createdAt) > new Date(filters.endDate)) return false;
            return true;
        });
        return Promise.all(filtered.map(o => this.enrichOrder(o)));
    }

    async createOrder(userId: string, items: any[], shippingAddressId?: string): Promise<Order> {
        const orderItems: OrderItem[] = [];

        for (const item of items) {
            let name = item.productName || item.name;
            let price = item.priceAtPurchase || item.price || 0;

            if (!name || price === 0) {
                try {
                    const res = await axios.get(`${INVENTORY_SERVICE_URL}/${item.productId}`);
                    name = name || res.data.name;
                    price = price || res.data.price;
                } catch (e: any) {
                    console.error(`Failed to fetch enrichment for ${item.productId} at ${INVENTORY_SERVICE_URL}/${item.productId}`, e.message);
                }
            }

            orderItems.push({
                productId: item.productId,
                productName: name || 'Unknown Product',
                name: name || 'Unknown Product',
                quantity: item.quantity,
                priceAtPurchase: price || 100
            });

            try {
                // Remove the /products suffix if standardening on base URL inclusively
                // Wait, the deduct endpoint is also under /products.
                // Since base is now .../products, we just use /:id/deduct.
                await axios.post(`${INVENTORY_SERVICE_URL}/${item.productId}/deduct`, {
                    quantity: item.quantity
                });
            } catch (error: any) {
                console.error(`Failed to deduct stock for product ${item.productId}`, error.message);
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
        const order = orders.find(o => o.id === id);
        if (!order) return undefined;
        return this.enrichOrder(order);
    }

    async updateOrderStatus(id: string, status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED'): Promise<Order | null> {
        const order = orders.find(o => o.id === id);
        if (!order) return null;
        order.status = status;
        return order;
    }
}
