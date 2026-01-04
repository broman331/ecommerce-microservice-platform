import { IShippingRepository } from './IShippingRepository';
import { ShippingAddress, Shipment, addresses as initialAddresses, shipments as initialShipments } from '../models/shippingModel';

export class MemoryShippingRepository implements IShippingRepository {
    private addresses: ShippingAddress[] = [...initialAddresses];
    private shipments: Shipment[] = [...initialShipments];

    async getAddresses(userId: string): Promise<ShippingAddress[]> {
        return this.addresses.filter(a => a.userId === userId);
    }

    async addAddress(address: ShippingAddress): Promise<ShippingAddress> {
        this.addresses.push(address);
        return address;
    }

    async createShipment(shipment: Shipment): Promise<Shipment> {
        this.shipments.push(shipment);
        return shipment;
    }

    async getShipment(id: string): Promise<Shipment | undefined> {
        return this.shipments.find(s => s.id === id);
    }
}
