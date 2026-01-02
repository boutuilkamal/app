import { Router } from 'express';
import { protect } from '../auth/auth.middleware';

const router = Router();

router.use(protect);

router.post('/genetic/upload', (req, res) => {
  res.json({ success: true, message: 'Upload genetic report' });
});

router.post('/blood/upload', (req, res) => {
  res.json({ success: true, message: 'Upload blood report' });
});

router.get('/genetic', (req, res) => {
  res.json({ success: true, message: 'Get genetic reports' });
});

router.get('/blood', (req, res) => {
  res.json({ success: true, message: 'Get blood reports' });
});

router.get('/genetic/:id', (req, res) => {
  res.json({ success: true, message: 'Get genetic report details' });
});

router.get('/blood/:id', (req, res) => {
  res.json({ success: true, message: 'Get blood report details' });
});

export default router;
