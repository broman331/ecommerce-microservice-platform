import { Promotion } from '../models/promotion';

export interface IPromotionRepository {
    findAll(): Promise<Promotion[]>;
    findByCode(code: string): Promise<Promotion | undefined>;
    save(promotion: Promotion): Promise<Promotion>;
}
