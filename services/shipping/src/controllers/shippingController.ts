import { Request, Response } from 'express';
import { ShippingService } from '../services/shippingService';
import { MemoryShippingRepository } from '../dal/MemoryShippingRepository';
import { DynamoShippingRepository } from '../dal/DynamoShippingRepository';
import { FirestoreShippingRepository } from '../dal/FirestoreShippingRepository';
import { IShippingRepository } from '../dal/IShippingRepository';

let shippingRepository: IShippingRepository;

switch (process.env.DB_PROVIDER) {
    case 'dynamodb':
        shippingRepository = new DynamoShippingRepository();
        break;
    case 'firestore':
        shippingRepository = new FirestoreShippingRepository();
        break;
    default:
        shippingRepository = new MemoryShippingRepository();
}

const shippingService = new ShippingService(shippingRepository);

export class ShippingController {

    constructor() {
        // No local state
    }

    public async getUserAddresses(req: Request, res: Response): Promise<void> {
        const { userId } = req.params;
        const addresses = await shippingService.getUserAddresses(userId);
        res.json(addresses);
    }

    public async addAddress(req: Request, res: Response): Promise<void> {
        const { userId } = req.params;
        const addressData = req.body;

        // Basic validation
        if (!addressData.fullName || !addressData.streetAddress || !addressData.city || !addressData.zipCode) {
            res.status(400).json({ error: 'Missing required address fields' });
            return;
        }

        const newAddress = await shippingService.addAddress({ userId, ...addressData });
        res.status(201).json(newAddress);
    }

    public async dispatch(req: Request, res: Response): Promise<void> {
        const { orderId, userId, addressId, items } = req.body;

        if (!orderId || !userId || !items || !items.length) {
            res.status(400).json({ error: 'Invalid shipment request' });
            return;
        }

        const shipment = await shippingService.dispatchShipment(orderId, userId, addressId, items);
        res.status(201).json(shipment);
    }
}

