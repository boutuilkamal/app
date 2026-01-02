import { Router } from 'express';
import { protect } from '../auth/auth.middleware';

const router = Router();

router.use(protect);

router.post('/conversations', (req, res) => {
  res.json({ success: true, message: 'Create AI conversation' });
});

router.get('/conversations', (req, res) => {
  res.json({ success: true, message: 'Get conversations' });
});

router.get('/conversations/:id', (req, res) => {
  res.json({ success: true, message: 'Get conversation details' });
});

router.post('/conversations/:id/messages', (req, res) => {
  res.json({ success: true, message: 'Send message to AI coach' });
});

export default router;
