import { Firestore } from '@google-cloud/firestore';
import { IOrderRepository } from './IOrderRepository';
import { Order } from '../models/Order';

const firestore = new Firestore();

export class FirestoreOrderRepository implements IOrderRepository {
    private collectionName = process.env.FIRESTORE_COLLECTION || 'orders';

    async findByUserId(userId: string): Promise<Order[]> {
        const snapshot = await firestore.collection(this.collectionName).where('userId', '==', userId).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    }

    async findById(id: string): Promise<Order | undefined> {
        const doc = await firestore.collection(this.collectionName).doc(id).get();
        if (!doc.exists) return undefined;
        return { id: doc.id, ...doc.data() } as Order;
    }

    async create(order: Order): Promise<Order> {
        await firestore.collection(this.collectionName).doc(order.id).set(order);
        return order;
    }

    async update(id: string, data: Partial<Order>): Promise<Order | undefined> {
        const docRef = firestore.collection(this.collectionName).doc(id);
        const doc = await docRef.get();
        if (!doc.exists) return undefined;
        await docRef.update(data);
        const updated = await docRef.get();
        return { id: updated.id, ...updated.data() } as Order;
    }

    async search(filters: { userId?: string, startDate?: string, endDate?: string }): Promise<Order[]> {
        let query: FirebaseFirestore.Query = firestore.collection(this.collectionName);

        if (filters.userId) {
            query = query.where('userId', '==', filters.userId);
        }
        if (filters.startDate) {
            query = query.where('createdAt', '>=', filters.startDate);
        }
        if (filters.endDate) {
            query = query.where('createdAt', '<=', filters.endDate);
        }

        const snapshot = await query.get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
    }
}
