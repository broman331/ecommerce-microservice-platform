import { Router } from 'express';
import { ProductController } from '../controllers/productController';

const router = Router();
const productController = new ProductController();

router.get('/', productController.getAllProducts.bind(productController));
router.post('/', productController.createProduct.bind(productController));
router.get('/:id', productController.getProductById.bind(productController));
router.patch('/:id', productController.updateProduct.bind(productController));
router.post('/:id/deduct', productController.deductStock.bind(productController));

export default router;
