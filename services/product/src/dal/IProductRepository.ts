import { EnrichedProduct } from '../services/aggregatorService'; // Will move model later probably

export interface IProductRepository {
    getAll(): Promise<EnrichedProduct[]>;
    getById(id: string): Promise<EnrichedProduct | null>;
    create(data: any): Promise<EnrichedProduct>;
    update(id: string, data: any): Promise<EnrichedProduct>;
}
