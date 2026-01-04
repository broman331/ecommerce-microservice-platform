import { IPromotionRepository } from './IPromotionRepository';
import { Promotion } from '../models/promotion';

const initialPromotions: Promotion[] = [
    { code: 'SAVE10', type: 'PERCENTAGE', value: 10, enabled: true },
    { code: 'MINUS5', type: 'FIXED_AMOUNT', value: 5, minOrderValue: 20, enabled: true },
    { code: 'WELCOME20', type: 'PERCENTAGE', value: 20, minOrderValue: 50, enabled: false },
];

export class MemoryPromotionRepository implements IPromotionRepository {
    private promotions: Promotion[] = [...initialPromotions];

    async findAll(): Promise<Promotion[]> {
        return this.promotions;
    }

    async findByCode(code: string): Promise<Promotion | undefined> {
        return this.promotions.find(p => p.code === code);
    }

    async save(promotion: Promotion): Promise<Promotion> {
        const index = this.promotions.findIndex(p => p.code === promotion.code);
        if (index >= 0) {
            this.promotions[index] = promotion;
        } else {
            this.promotions.push(promotion);
        }
        return promotion;
    }
}
