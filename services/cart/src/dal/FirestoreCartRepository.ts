import { Firestore } from '@google-cloud/firestore';
import { ICartRepository } from './ICartRepository';
import { Cart } from '../models/Cart';

const firestore = new Firestore();

export class FirestoreCartRepository implements ICartRepository {
    private collectionName = process.env.FIRESTORE_COLLECTION || 'carts';

    async findByCustomerId(customerId: string): Promise<Cart | undefined> {
        const doc = await firestore.collection(this.collectionName).doc(customerId).get();
        if (!doc.exists) return undefined;
        return { customerId: doc.id, ...doc.data() } as Cart;
    }

    async createOrUpdate(cart: Cart): Promise<Cart> {
        await firestore.collection(this.collectionName).doc(cart.customerId).set(cart);
        return cart;
    }

    async delete(customerId: string): Promise<void> {
        await firestore.collection(this.collectionName).doc(customerId).delete();
    }
}
