import { Request, Response } from 'express';
import { ProductService } from '../services/aggregatorService';
import { AggregatorProductRepository } from '../dal/AggregatorProductRepository';
import { DynamoProductRepository } from '../dal/DynamoProductRepository';
import { FirestoreProductRepository } from '../dal/FirestoreProductRepository';
import { MemoryProductRepository } from '../dal/MemoryProductRepository';
import { IProductRepository } from '../dal/IProductRepository';

let productRepository: IProductRepository;

switch (process.env.DB_PROVIDER) {
    case 'dynamodb':
        productRepository = new DynamoProductRepository();
        break;
    case 'firestore':
        productRepository = new FirestoreProductRepository();
        break;
    case 'memory':
        productRepository = new MemoryProductRepository();
        break;
    default:
        // Default to Aggregator mode if not specified or explicit 'aggregator'
        productRepository = new AggregatorProductRepository();
}

const productService = new ProductService(productRepository);

export class ProductController {
    async getAll(req: Request, res: Response) {
        try {
            const products = await productService.getAllEnrichedProducts();
            res.json(products);
        } catch (error) {
            console.error('Error in getAll products:', error);
            res.status(500).json({ message: 'Error fetching products' });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const product = await productService.getEnrichedProduct(id);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.json(product);
        } catch (e) {
            console.error('Error fetching product by ID:', e);
            res.status(500).json({ message: 'Error fetching product' });
        }
    }

    async create(req: Request, res: Response) {
        try {
            const product = await productService.createEnrichedProduct(req.body);
            res.status(201).json(product);
        } catch (e) {
            const err = e as any;
            console.error(err.message);
            res.status(500).json({ message: 'Failed to create product via aggregator' });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const product = await productService.updateEnrichedProduct(id, req.body);
            res.json(product);
        } catch (e) {
            const err = e as any;
            console.error(err.message);
            res.status(500).json({ message: 'Failed to update product via aggregator' });
        }
    }
}

