import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticateJWT } from '../middleware/authMiddleware';

const router = Router();
const userController = new UserController();

// Public/Admin routes (for demo simplicity, no auth required for these admin views yet, or basic auth)
router.get('/', userController.getAllUsers);
router.get('/profile', authenticateJWT, userController.getProfile.bind(userController));
router.get('/:id', userController.getUserById);

export default router;
