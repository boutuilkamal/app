import { Router } from 'express';
import { protect } from '../auth/auth.middleware';

const router = Router();

router.use(protect);

router.post('/plans', (req, res) => {
  res.json({ success: true, message: 'Create nutrition plan' });
});

router.get('/plans', (req, res) => {
  res.json({ success: true, message: 'Get nutrition plans' });
});

router.get('/plans/:id', (req, res) => {
  res.json({ success: true, message: 'Get nutrition plan details' });
});

router.put('/plans/:id', (req, res) => {
  res.json({ success: true, message: 'Update nutrition plan' });
});

router.delete('/plans/:id', (req, res) => {
  res.json({ success: true, message: 'Delete nutrition plan' });
});

export default router;
