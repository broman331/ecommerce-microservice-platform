import { IProductRepository } from '../dal/IProductRepository';

// Definitions matching other services
interface InventoryProduct {
    id: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    enabled: boolean;
}

export interface EnrichedProduct extends InventoryProduct {
    totalOrders: number;
    lastOrderedAt: string | null;
}

export class ProductService {
    constructor(private repository: IProductRepository) { }

    async getAllEnrichedProducts(): Promise<EnrichedProduct[]> {
        return this.repository.getAll();
    }

    async getEnrichedProduct(id: string): Promise<EnrichedProduct | null> {
        return this.repository.getById(id);
    }

    async createEnrichedProduct(data: any): Promise<EnrichedProduct> {
        return this.repository.create(data);
    }

    async updateEnrichedProduct(id: string, data: any): Promise<EnrichedProduct> {
        return this.repository.update(id, data);
    }
}

// Alias for backward compatibility if any internal storage used it? 
export { ProductService as AggregatorService };

