import { IProductRepository } from './IProductRepository';
import { EnrichedProduct } from '../services/aggregatorService';

export class MemoryProductRepository implements IProductRepository {
    private products: Map<string, EnrichedProduct> = new Map();

    async getAll(): Promise<EnrichedProduct[]> {
        return Array.from(this.products.values());
    }

    async getById(id: string): Promise<EnrichedProduct | null> {
        return this.products.get(id) || null;
    }

    async create(data: any): Promise<EnrichedProduct> {
        const id = data.id || `prod-${Date.now()}`;
        const product = { id, ...data, totalOrders: 0, lastOrderedAt: null };
        this.products.set(id, product);
        return product;
    }

    async update(id: string, data: any): Promise<EnrichedProduct> {
        const existing = this.products.get(id);
        if (!existing) throw new Error("Product not found");
        const updated = { ...existing, ...data };
        this.products.set(id, updated);
        return updated;
    }
}
