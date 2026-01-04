import { IProductRepository } from './IProductRepository';
import { Product, products as initialProducts } from '../models/Product';

export class MemoryProductRepository implements IProductRepository {
    private products: Product[] = [...initialProducts];

    async findAll(): Promise<Product[]> {
        return this.products;
    }

    async findById(id: string): Promise<Product | undefined> {
        return this.products.find(p => p.id === id);
    }

    async create(product: Product): Promise<Product> {
        this.products.push(product);
        return product;
    }

    async update(id: string, data: Partial<Product>): Promise<Product | undefined> {
        const productIndex = this.products.findIndex(p => p.id === id);
        if (productIndex === -1) return undefined;

        const updatedProduct = { ...this.products[productIndex], ...data };
        this.products[productIndex] = updatedProduct;

        return updatedProduct;
    }
}
