import { Product } from '../models/Product';
import { IProductRepository } from '../dal/IProductRepository';

export class ProductService {
    constructor(private repository: IProductRepository) { }

    async findAll(): Promise<Product[]> {
        return this.repository.findAll();
    }

    async findById(id: string): Promise<Product | undefined> {
        return this.repository.findById(id);
    }

    async createProduct(data: Omit<Product, 'id'>): Promise<Product> {
        const products = await this.repository.findAll();
        const newProduct: Product = {
            id: (products.length + 1).toString(), // Simple ID generation
            ...data
        };
        return this.repository.create(newProduct);
    }

    async updateProduct(id: string, data: Partial<Product>): Promise<Product | undefined> {
        return this.repository.update(id, data);
    }

    async deductStock(id: string, quantity: number): Promise<boolean> {
        const product = await this.repository.findById(id);
        if (!product || product.stock < quantity) return false;

        const newStock = product.stock - quantity;
        await this.repository.update(id, { stock: newStock });
        return true;
    }
}

