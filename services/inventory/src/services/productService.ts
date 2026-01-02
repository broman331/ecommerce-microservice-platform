import { products, Product } from '../models/Product';

export class ProductService {
    async findAll(): Promise<Product[]> {
        return products;
    }

    async findById(id: string): Promise<Product | undefined> {
        return products.find(p => p.id === id);
    }

    async createProduct(data: Omit<Product, 'id'>): Promise<Product> {
        const newProduct: Product = {
            id: (products.length + 1).toString(),
            ...data
        };
        products.push(newProduct);
        return newProduct;
    }

    async updateProduct(id: string, data: Partial<Product>): Promise<Product | undefined> {
        const product = products.find(p => p.id === id);
        if (!product) return undefined;

        Object.assign(product, data);
        return product;
    }

    async deductStock(id: string, quantity: number): Promise<boolean> {
        const product = products.find(p => p.id === id);
        if (!product || product.stock < quantity) return false;

        product.stock -= quantity;
        return true;
    }
}
