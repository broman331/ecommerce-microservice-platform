import { Router } from 'express';
import { OrderController } from '../controllers/orderController';

const router = Router();
const orderController = new OrderController();

router.get('/', orderController.getUserOrders.bind(orderController));
router.get('/search', orderController.searchOrders.bind(orderController));
router.post('/', orderController.createOrder.bind(orderController));
router.get('/:id', orderController.getOrder.bind(orderController));
router.patch('/:id/status', orderController.updateStatus.bind(orderController));

export default router;
