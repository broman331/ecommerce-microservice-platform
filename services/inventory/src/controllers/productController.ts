import { Request, Response } from 'express';
import { ProductService } from '../services/productService';

const productService = new ProductService();

export class ProductController {
    async getAllProducts(req: Request, res: Response) {
        const products = await productService.findAll();
        res.json(products);
    }

    async getProductById(req: Request, res: Response) {
        const { id } = req.params;
        const product = await productService.findById(id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json(product);
    }

    async createProduct(req: Request, res: Response) {
        const { name, description, price, stock } = req.body;
        if (!name || !price) {
            return res.status(400).json({ message: 'Name and Price required' });
        }
        const product = await productService.createProduct({ name, description, price, stock, enabled: true });
        res.status(201).json(product);
    }

    async updateProduct(req: Request, res: Response) {
        const { id } = req.params;
        const product = await productService.updateProduct(id, req.body);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    }

    async deductStock(req: Request, res: Response) {
        const { id } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Valid quantity required' });
        }

        const success = await productService.deductStock(id, quantity);
        if (!success) {
            return res.status(400).json({ message: 'Insufficient stock or product not found' });
        }
        res.json({ success: true });
    }
}
