import { Product } from '../models/Product';

export interface IProductRepository {
    findAll(): Promise<Product[]>;
    findById(id: string): Promise<Product | undefined>;
    create(product: Product): Promise<Product>;
    update(id: string, product: Partial<Product>): Promise<Product | undefined>;
}
