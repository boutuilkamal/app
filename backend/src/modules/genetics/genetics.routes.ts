import { Router } from 'express';
import { protect } from '../auth/auth.middleware';

const router = Router();

router.use(protect);

router.get('/genes', (req, res) => {
  res.json({ success: true, message: 'Get all genes' });
});

router.get('/genes/:symbol', (req, res) => {
  res.json({ success: true, message: 'Get gene by symbol' });
});

router.get('/categories', (req, res) => {
  res.json({ success: true, message: 'Get gene categories' });
});

export default router;
