import { Router } from 'express';
import { CartController } from '../controllers/cartController';

const router = Router();
const cartController = new CartController();

// Bind controller methods to ensure 'this' context is preserved
router.get('/', cartController.getAllCarts.bind(cartController));
router.post('/:customerId/promotion', cartController.applyPromotion.bind(cartController));
router.get('/:customerId', cartController.getCart.bind(cartController));
router.post('/:customerId/items', cartController.addToCart.bind(cartController));
router.put('/:customerId/items/:productId', cartController.updateCartItem.bind(cartController));
router.put('/:customerId/address', cartController.updateShippingAddress.bind(cartController));
router.delete('/:customerId/items/:productId', cartController.removeFromCart.bind(cartController));
router.post('/:customerId/checkout', cartController.checkout.bind(cartController));
router.delete('/:customerId', cartController.clearCart.bind(cartController));

export default router;
