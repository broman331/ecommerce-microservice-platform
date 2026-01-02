import { Request, Response } from 'express';
import { AggregatorService } from '../services/aggregatorService';

const aggregator = new AggregatorService();

export class ProductController {
    async getAll(req: Request, res: Response) {
        try {
            const products = await aggregator.getAllEnrichedProducts();
            res.json(products);
        } catch (error) {
            console.error('Error in getAll products:', error);
            res.status(500).json({ message: 'Error fetching products' });
        }
    }

    async getById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const product = await aggregator.getEnrichedProduct(id);
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
            const product = await aggregator.createEnrichedProduct(req.body);
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
            const product = await aggregator.updateEnrichedProduct(id, req.body);
            res.json(product);
        } catch (e) {
            const err = e as any;
            console.error(err.message);
            res.status(500).json({ message: 'Failed to update product via aggregator' });
        }
    }
}
