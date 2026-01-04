import { IOrderRepository } from './IOrderRepository';
import { Order, orders as initialOrders } from '../models/Order';

export class MemoryOrderRepository implements IOrderRepository {
    private orders: Order[] = [...initialOrders];

    async findByUserId(userId: string): Promise<Order[]> {
        return this.orders.filter(o => o.userId === userId);
    }

    async findById(id: string): Promise<Order | undefined> {
        return this.orders.find(o => o.id === id);
    }

    async create(order: Order): Promise<Order> {
        this.orders.push(order);
        return order;
    }

    async update(id: string, data: Partial<Order>): Promise<Order | undefined> {
        const orderIndex = this.orders.findIndex(o => o.id === id);
        if (orderIndex === -1) return undefined;

        const updatedOrder = { ...this.orders[orderIndex], ...data };
        this.orders[orderIndex] = updatedOrder;
        return updatedOrder;
    }

    async search(filters: { userId?: string, startDate?: string, endDate?: string }): Promise<Order[]> {
        return this.orders.filter(o => {
            if (filters.userId && o.userId !== filters.userId) return false;
            if (filters.startDate && new Date(o.createdAt) < new Date(filters.startDate)) return false;
            if (filters.endDate && new Date(o.createdAt) > new Date(filters.endDate)) return false;
            return true;
        });
    }
}
