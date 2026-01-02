import { Router } from 'express';
import { ShippingController } from '../controllers/shippingController';

const router = Router();
const shippingController = new ShippingController();

router.get('/:userId/addresses', shippingController.getUserAddresses.bind(shippingController));
router.post('/:userId/addresses', shippingController.addAddress.bind(shippingController));
router.post('/dispatch', shippingController.dispatch.bind(shippingController));

export default router;
