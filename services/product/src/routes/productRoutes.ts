import { Router } from 'express';
import { ProductController } from '../controllers/productController';

const router = Router();
const controller = new ProductController();

router.get('/store/products', controller.getAll.bind(controller));
router.post('/store/products', controller.create.bind(controller));
router.get('/store/products/:id', controller.getById.bind(controller));
router.patch('/store/products/:id', controller.update.bind(controller));

// Also expose a root health check or simple list?
// Using the path defined in OpenAPI: /store/products
export default router;
