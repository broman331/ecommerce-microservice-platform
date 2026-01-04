import { Firestore } from '@google-cloud/firestore';
import { ICustomerRepository, CustomerProfile } from './ICustomerRepository';

const firestore = new Firestore();

export class FirestoreCustomerRepository implements ICustomerRepository {
    private collectionName = process.env.FIRESTORE_COLLECTION || 'customers-profile';

    async getProfile(userId: string): Promise<CustomerProfile | null> {
        const doc = await firestore.collection(this.collectionName).doc(userId).get();
        if (!doc.exists) return null;
        return { id: doc.id, ...doc.data() } as CustomerProfile;
    }

    async saveProfile(profile: CustomerProfile): Promise<CustomerProfile> {
        await firestore.collection(this.collectionName).doc(profile.id).set(profile);
        return profile;
    }
}
