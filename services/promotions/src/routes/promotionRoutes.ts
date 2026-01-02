import { Router } from 'express';
import { PromotionController } from '../controllers/promotionController';

const router = Router();
const controller = new PromotionController();

router.get('/', controller.getAll.bind(controller));
router.post('/', controller.create.bind(controller));
router.post('/:code/toggle', controller.toggle.bind(controller));
router.post('/apply', controller.apply.bind(controller));

export default router;
