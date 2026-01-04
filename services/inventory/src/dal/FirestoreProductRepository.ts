import { Firestore } from '@google-cloud/firestore';
import { IProductRepository } from './IProductRepository';
import { Product } from '../models/Product';

const firestore = new Firestore();

export class FirestoreProductRepository implements IProductRepository {
    private collectionName = process.env.FIRESTORE_COLLECTION || 'products';

    async findAll(): Promise<Product[]> {
        const snapshot = await firestore.collection(this.collectionName).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    }

    async findById(id: string): Promise<Product | undefined> {
        const doc = await firestore.collection(this.collectionName).doc(id).get();
        if (!doc.exists) return undefined;
        return { id: doc.id, ...doc.data() } as Product;
    }

    async create(product: Product): Promise<Product> {
        // Use ID from product if provided, else auto-gen
        // Ideally we should let Firestore gen ID if it's new, but our model has 'id'.
        // If we want consistency, we use the model's ID as the doc ID.
        await firestore.collection(this.collectionName).doc(product.id).set(product);
        return product;
    }

    async update(id: string, data: Partial<Product>): Promise<Product | undefined> {
        const docRef = firestore.collection(this.collectionName).doc(id);
        const doc = await docRef.get();

        if (!doc.exists) return undefined;

        await docRef.update(data);

        // Return updated data (fetch again to be sure or merge locally)
        const updated = await docRef.get();
        return { id: updated.id, ...updated.data() } as Product;
    }
}
