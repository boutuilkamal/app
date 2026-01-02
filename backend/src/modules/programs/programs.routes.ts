import { Router } from 'express';
import { protect } from '../auth/auth.middleware';

const router = Router();

router.use(protect);

router.post('/fitness', (req, res) => {
  res.json({ success: true, message: 'Create fitness program' });
});

router.get('/fitness', (req, res) => {
  res.json({ success: true, message: 'Get fitness programs' });
});

router.get('/fitness/:id', (req, res) => {
  res.json({ success: true, message: 'Get fitness program details' });
});

router.put('/fitness/:id', (req, res) => {
  res.json({ success: true, message: 'Update fitness program' });
});

router.delete('/fitness/:id', (req, res) => {
  res.json({ success: true, message: 'Delete fitness program' });
});

export default router;
