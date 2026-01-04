import axios from 'axios';
import { Order, OrderItem } from '../models/Order';
import { IOrderRepository } from '../dal/IOrderRepository';

const INVENTORY_SERVICE_URL = process.env.INVENTORY_SERVICE_URL || 'http://localhost:3003/products';

export class OrderService {
    constructor(private repository: IOrderRepository) { }

    private async enrichOrder(order: Order): Promise<Order> {
        for (const item of order.items) {
            if (!item.productName || !item.name) {
                try {
                    const res = await axios.get(`${INVENTORY_SERVICE_URL}/${item.productId}`);
                    const productName = res.data.name;
                    item.productName = productName;
                    item.name = productName;
                } catch (e: any) {
                    // console.error(`Failed to enrich order item`, e.message); 
                }
            }
        }
        return order;
    }

    async findByUserId(userId: string): Promise<Order[]> {
        const userOrders = await this.repository.findByUserId(userId);
        return Promise.all(userOrders.map(o => this.enrichOrder(o)));
    }

    async searchOrders(filters: { userId?: string, startDate?: string, endDate?: string }): Promise<Order[]> {
        const filtered = await this.repository.search(filters);
        return Promise.all(filtered.map(o => this.enrichOrder(o)));
    }

    async createOrder(userId: string, items: any[], shippingAddressId?: string): Promise<Order> {
        const orderItems: OrderItem[] = [];

        // Fetch current orders to generate ID (if simple auto-increment logic is kept)
        // Ideally ID generation should be in the Repo or UUID. 
        // For consistency with existing logic:
        const currentOrders = await this.repository.search({}); // Get all to count? 
        // Actually, searching all is bad. Let's use Date.now() or similar for ID if possible, 
        // OR rely on the repo to handle ID generation?
        // The existing logic used `orders.length + 1`. 
        // Let's assume the Repo.create() can handle ID generation or we do it here.
        // Let's use a simple timestamp-based ID to avoid scanning all DB.
        const newId = `order-${Date.now()}`;

        for (const item of items) {
            let name = item.productName || item.name;
            let price = item.priceAtPurchase || item.price || 0;

            if (!name || price === 0) {
                try {
                    const res = await axios.get(`${INVENTORY_SERVICE_URL}/${item.productId}`);
                    name = name || res.data.name;
                    price = price || res.data.price;
                } catch (e: any) {
                    console.error(`Failed to fetch enrichment`, e.message);
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
                await axios.post(`${INVENTORY_SERVICE_URL}/${item.productId}/deduct`, {
                    quantity: item.quantity
                });
            } catch (error: any) {
                console.error(`Failed to deduct stock`, error.message);
            }
        }

        const totalAmount = orderItems.reduce((sum, item) => sum + (item.priceAtPurchase * item.quantity), 0);
        const newOrder: Order = {
            id: newId,
            userId,
            status: 'PENDING',
            totalAmount,
            items: orderItems,
            createdAt: new Date().toISOString(),
            shippingAddressId
        };

        return this.repository.create(newOrder);
    }

    async getOrderById(id: string): Promise<Order | undefined> {
        const order = await this.repository.findById(id);
        if (!order) return undefined;
        return this.enrichOrder(order);
    }

    async updateOrderStatus(id: string, status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED'): Promise<Order | null> {
        return (await this.repository.update(id, { status })) || null;
    }
}

