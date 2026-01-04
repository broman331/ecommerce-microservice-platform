import { Firestore } from '@google-cloud/firestore';
import { IUserRepository } from './IUserRepository';
import { User } from '../models/User';

const firestore = new Firestore();

export class FirestoreUserRepository implements IUserRepository {
    private collectionName = process.env.FIRESTORE_COLLECTION || 'users';

    async findAll(): Promise<User[]> {
        const snapshot = await firestore.collection(this.collectionName).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
    }

    async findByEmail(email: string): Promise<User | undefined> {
        const snapshot = await firestore.collection(this.collectionName).where('email', '==', email).get();
        if (snapshot.empty) return undefined;
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() } as User;
    }

    async findById(id: string): Promise<User | undefined> {
        const doc = await firestore.collection(this.collectionName).doc(id).get();
        if (!doc.exists) return undefined;
        return { id: doc.id, ...doc.data() } as User;
    }

    async create(user: User): Promise<User> {
        await firestore.collection(this.collectionName).doc(user.id).set(user);
        return user;
    }
}
