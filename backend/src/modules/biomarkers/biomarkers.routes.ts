import { Router } from 'express';
import { protect } from '../auth/auth.middleware';

const router = Router();

router.use(protect);

router.get('/', (req, res) => {
  res.json({ success: true, message: 'Get all biomarkers' });
});

router.get('/:name', (req, res) => {
  res.json({ success: true, message: 'Get biomarker by name' });
});

router.get('/categories', (req, res) => {
  res.json({ success: true, message: 'Get biomarker categories' });
});

export default router;
