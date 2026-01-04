import { Firestore } from '@google-cloud/firestore';
import { IShippingRepository } from './IShippingRepository';
import { ShippingAddress, Shipment } from '../models/shippingModel';

const firestore = new Firestore();

export class FirestoreShippingRepository implements IShippingRepository {
    private addressCollection = process.env.FIRESTORE_ADDRESS_COLLECTION || 'shipping-addresses';
    private shipmentCollection = process.env.FIRESTORE_SHIPMENT_COLLECTION || 'shipments';

    async getAddresses(userId: string): Promise<ShippingAddress[]> {
        const snapshot = await firestore.collection(this.addressCollection).where('userId', '==', userId).get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ShippingAddress));
    }

    async addAddress(address: ShippingAddress): Promise<ShippingAddress> {
        await firestore.collection(this.addressCollection).doc(address.id).set(address);
        return address;
    }

    async createShipment(shipment: Shipment): Promise<Shipment> {
        await firestore.collection(this.shipmentCollection).doc(shipment.id).set(shipment);
        return shipment;
    }

    async getShipment(id: string): Promise<Shipment | undefined> {
        const doc = await firestore.collection(this.shipmentCollection).doc(id).get();
        if (!doc.exists) return undefined;
        return { id: doc.id, ...doc.data() } as Shipment;
    }
}
