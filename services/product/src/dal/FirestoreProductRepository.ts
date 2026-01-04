import { Firestore } from '@google-cloud/firestore';
import { IProductRepository } from './IProductRepository';
import { EnrichedProduct } from '../services/aggregatorService';

const firestore = new Firestore();

export class FirestoreProductRepository implements IProductRepository {
    private collectionName = process.env.FIRESTORE_COLLECTION || 'products-enriched';

    async getAll(): Promise<EnrichedProduct[]> {
        const snapshot = await firestore.collection(this.collectionName).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EnrichedProduct));
    }

    async getById(id: string): Promise<EnrichedProduct | null> {
        const doc = await firestore.collection(this.collectionName).doc(id).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() } as EnrichedProduct;
    }

    async create(data: any): Promise<EnrichedProduct> {
        const id = data.id || firestore.collection(this.collectionName).doc().id;
        const product = { ...data, id, totalOrders: 0, lastOrderedAt: null };
        await firestore.collection(this.collectionName).doc(id).set(product);
        return product;
    }

    async update(id: string, data: any): Promise<EnrichedProduct> {
        await firestore.collection(this.collectionName).doc(id).update(data);
        const updated = await this.getById(id);
        if (!updated) throw new Error("Failed to update");
        return updated;
    }
}
