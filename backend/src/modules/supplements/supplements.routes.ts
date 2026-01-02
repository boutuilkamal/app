import { Router } from 'express';
import { protect } from '../auth/auth.middleware';

const router = Router();

router.use(protect);

router.post('/protocols', (req, res) => {
  res.json({ success: true, message: 'Create supplement protocol' });
});

router.get('/protocols', (req, res) => {
  res.json({ success: true, message: 'Get supplement protocols' });
});

router.get('/protocols/:id', (req, res) => {
  res.json({ success: true, message: 'Get supplement protocol details' });
});

router.put('/protocols/:id', (req, res) => {
  res.json({ success: true, message: 'Update supplement protocol' });
});

router.delete('/protocols/:id', (req, res) => {
  res.json({ success: true, message: 'Delete supplement protocol' });
});

export default router;
