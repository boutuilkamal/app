import { Router } from 'express';
import { protect, authorize } from '../auth/auth.middleware';
import { UserRole } from '../../types/enums';

const router = Router();

router.use(protect);

router.get('/profile', (req, res) => {
  res.json({ success: true, message: 'User profile' });
});

router.put('/profile', (req, res) => {
  res.json({ success: true, message: 'Profile updated' });
});

router.get('/clients', authorize(UserRole.COACH, UserRole.ADMIN), (req, res) => {
  res.json({ success: true, message: 'Get coach clients' });
});

export default router;
