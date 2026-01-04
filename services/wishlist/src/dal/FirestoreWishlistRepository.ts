import { Firestore } from '@google-cloud/firestore';
import { IWishlistRepository } from './IWishlistRepository';
import { Wishlist } from '../models/Wishlist';

const firestore = new Firestore();

export class FirestoreWishlistRepository implements IWishlistRepository {
    private collectionName = process.env.FIRESTORE_COLLECTION || 'wishlists';

    async findByCustomerId(customerId: string): Promise<Wishlist | undefined> {
        const doc = await firestore.collection(this.collectionName).doc(customerId).get();
        if (!doc.exists) return undefined;
        return { customerId: doc.id, ...doc.data() } as Wishlist;
    }

    async save(wishlist: Wishlist): Promise<Wishlist> {
        await firestore.collection(this.collectionName).doc(wishlist.customerId).set(wishlist);
        return wishlist;
    }
}
