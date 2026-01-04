import { ICartRepository } from './ICartRepository';
import { Cart } from '../models/Cart';

export class MemoryCartRepository implements ICartRepository {
    private carts: Map<string, Cart> = new Map();

    async findByCustomerId(customerId: string): Promise<Cart | undefined> {
        return this.carts.get(customerId);
    }

    async createOrUpdate(cart: Cart): Promise<Cart> {
        this.carts.set(cart.customerId, cart);
        return cart;
    }

    async delete(customerId: string): Promise<void> {
        this.carts.delete(customerId);
    }
}
