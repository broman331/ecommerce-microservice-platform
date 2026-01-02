import { Request, Response } from 'express';
import { ShippingService } from '../services/shippingService';

const shippingService = new ShippingService();

export class ShippingController {
    async getUserAddresses(req: Request, res: Response) {
        const { userId } = req.params;
        const addresses = await shippingService.getUserAddresses(userId);
        res.json(addresses);
    }

    async addAddress(req: Request, res: Response) {
        const { userId } = req.params;
        const addressData = req.body;

        if (!addressData.streetAddress || !addressData.city) {
            return res.status(400).json({ message: 'Missing address fields' });
        }

        const newAddress = await shippingService.addAddress({ ...addressData, userId });
        res.status(201).json(newAddress);
    }

    async dispatch(req: Request, res: Response) {
        const { orderId, userId, addressId, items } = req.body;

        if (!orderId || !userId || !items || !items.length) {
            return res.status(400).json({ message: 'Invalid shipment request' });
        }

        const shipment = await shippingService.dispatchShipment(orderId, userId, addressId, items);
        res.status(201).json(shipment);
    }
}
