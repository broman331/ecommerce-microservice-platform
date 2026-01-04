import { Firestore } from '@google-cloud/firestore';
import { IPromotionRepository } from './IPromotionRepository';
import { Promotion } from '../models/promotion';

const firestore = new Firestore();

export class FirestorePromotionRepository implements IPromotionRepository {
    private collectionName = process.env.FIRESTORE_COLLECTION || 'promotions';

    async findAll(): Promise<Promotion[]> {
        const snapshot = await firestore.collection(this.collectionName).get();
        return snapshot.docs.map(doc => ({ code: doc.id, ...doc.data() } as Promotion));
    }

    async findByCode(code: string): Promise<Promotion | undefined> {
        const doc = await firestore.collection(this.collectionName).doc(code).get();
        if (!doc.exists) return undefined;
        return { code: doc.id, ...doc.data() } as Promotion;
    }

    async save(promotion: Promotion): Promise<Promotion> {
        await firestore.collection(this.collectionName).doc(promotion.code).set(promotion);
        return promotion;
    }
}
