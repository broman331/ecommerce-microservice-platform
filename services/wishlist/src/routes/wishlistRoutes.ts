import { Router } from 'express';
import { WishlistController } from '../controllers/wishlistController';

const router = Router();
const controller = new WishlistController();

router.get('/:userId', controller.getWishlist.bind(controller));
router.post('/:userId/add', controller.addToWishlist.bind(controller));
router.delete('/:userId/remove/:productId', controller.removeFromWishlist.bind(controller));

export default router;
