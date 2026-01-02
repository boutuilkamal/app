import { Router } from 'express';
import { AuthController } from './auth.controller';
import { protect } from './auth.middleware';

const router = Router();
const authController = new AuthController();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', protect, authController.getMe);
router.post('/change-password', protect, authController.changePassword);

export default router;
