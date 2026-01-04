import { Request, Response } from 'express';
import { PromotionService } from '../services/promotionService';
import { MemoryPromotionRepository } from '../dal/MemoryPromotionRepository';
import { DynamoPromotionRepository } from '../dal/DynamoPromotionRepository';
import { FirestorePromotionRepository } from '../dal/FirestorePromotionRepository';
import { IPromotionRepository } from '../dal/IPromotionRepository';

let promotionRepository: IPromotionRepository;

switch (process.env.DB_PROVIDER) {
    case 'dynamodb':
        promotionRepository = new DynamoPromotionRepository();
        break;
    case 'firestore':
        promotionRepository = new FirestorePromotionRepository();
        break;
    default:
        promotionRepository = new MemoryPromotionRepository();
}

const promotionService = new PromotionService(promotionRepository);

export class PromotionController {

    constructor() {
        // No local state
    }

    public async getAll(req: Request, res: Response): Promise<void> {
        const promotions = await promotionService.getAllPromotions();
        res.json(promotions);
    }

    public async create(req: Request, res: Response): Promise<void> {
        try {
            const promo = req.body;
            // Basic validation
            if (!promo.code || !promo.type || !promo.value) {
                res.status(400).json({ error: 'Missing required fields: code, type, value' });
                return;
            }
            // Default enabled
            if (promo.enabled === undefined) promo.enabled = true;

            const newPromo = await promotionService.createPromotion(promo);
            res.status(201).json(newPromo);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    public async toggle(req: Request, res: Response): Promise<void> {
        try {
            const { code } = req.params;
            const updated = await promotionService.togglePromotion(code);
            res.json(updated);
        } catch (error: any) {
            res.status(404).json({ error: error.message });
        }
    }

    public async apply(req: Request, res: Response): Promise<void> {
        try {
            const { customerId, couponCode } = req.body;

            if (!customerId || !couponCode) {
                res.status(400).json({ error: 'customerId and couponCode are required' });
                return;
            }

            const result = await promotionService.applyPromotion(customerId, couponCode);
            res.json(result);
        } catch (error: any) {
            res.status(400).json({ error: error.message || 'Failed to apply promotion' });
        }
    }
}

