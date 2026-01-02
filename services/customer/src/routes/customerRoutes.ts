import { Router } from 'express';
import { CustomerController } from '../controllers/customerController';

const router = Router();
const controller = new CustomerController();

// Customer - My Data
router.get('/me/orders', controller.getMyOrders.bind(controller));
router.get('/me/wishlist', controller.getMyWishlist.bind(controller));
router.post('/me/wishlist', controller.addToMyWishlist.bind(controller));
router.delete('/me/wishlist/:productId', controller.removeFromMyWishlist.bind(controller));

// Admin - All Data
router.get('/', controller.getAllCustomers.bind(controller));
router.get('/orders', controller.searchOrders.bind(controller)); // New Search Endpoint
router.get('/:id', controller.getCustomerDetails.bind(controller));

export default router;
