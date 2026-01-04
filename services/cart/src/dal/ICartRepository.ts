import { Cart } from '../models/Cart';

export interface ICartRepository {
    findByCustomerId(customerId: string): Promise<Cart | undefined>;
    createOrUpdate(cart: Cart): Promise<Cart>;
    delete(customerId: string): Promise<void>;
}
