import { Order } from '../models/Order';

export interface IOrderRepository {
    findByUserId(userId: string): Promise<Order[]>;
    findById(id: string): Promise<Order | undefined>;
    create(order: Order): Promise<Order>;
    update(id: string, order: Partial<Order>): Promise<Order | undefined>;
    search(filters: { userId?: string, startDate?: string, endDate?: string }): Promise<Order[]>;
}
