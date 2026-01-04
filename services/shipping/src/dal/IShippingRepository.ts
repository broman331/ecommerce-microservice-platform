import { ShippingAddress, Shipment } from '../models/shippingModel';

export interface IShippingRepository {
    getAddresses(userId: string): Promise<ShippingAddress[]>;
    addAddress(address: ShippingAddress): Promise<ShippingAddress>;
    createShipment(shipment: Shipment): Promise<Shipment>;
    getShipment(id: string): Promise<Shipment | undefined>;
}
