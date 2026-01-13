import { Router } from 'express';
import { protect } from '../auth/auth.middleware';
import dnaReportRoutes from './dna-report.routes';

const router = Router();

router.use(protect);

// DNA Report routes (Coach-only)
router.use('/dna', dnaReportRoutes);

// Legacy/placeholder blood report routes
router.post('/blood/upload', (req, res) => {
  res.json({ success: true, message: 'Upload blood report' });
});

router.get('/blood', (req, res) => {
  res.json({ success: true, message: 'Get blood reports' });
});

router.get('/blood/:id', (req, res) => {
  res.json({ success: true, message: 'Get blood report details' });
});

export default router;
