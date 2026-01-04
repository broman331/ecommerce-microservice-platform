import { Shipment, ShippingAddress } from '../models/shippingModel';
import { IShippingRepository } from '../dal/IShippingRepository';
import { randomUUID } from 'crypto';

export class ShippingService {
    constructor(private repository: IShippingRepository) { }

    async getUserAddresses(userId: string): Promise<ShippingAddress[]> {
        return this.repository.getAddresses(userId);
    }

    async addAddress(address: Omit<ShippingAddress, 'id'>): Promise<ShippingAddress> {
        const newAddress: ShippingAddress = {
            id: randomUUID(),
            ...address
        };
        return this.repository.addAddress(newAddress);
    }

    async dispatchShipment(orderId: string, userId: string, addressId: string, items: any[]): Promise<Shipment> {
        // Simulate Distributor API call
        // In reality, this would make an HTTPS request to an external logistics provider

        const trackingNumber = `TRK-${Math.floor(Math.random() * 1000000000)}`;

        const newShipment: Shipment = {
            id: randomUUID(),
            orderId,
            userId,
            distributorId: 'DIST-001',
            status: 'PROCESSING',
            trackingNumber,
            shippedAt: new Date().toISOString(),
            items
        };

        return this.repository.createShipment(newShipment);
    }
}

