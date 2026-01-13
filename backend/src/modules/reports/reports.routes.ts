import { Router } from 'express';
import { protect } from '../auth/auth.middleware';
import dnaReportRoutes from './dna-report.routes';
import bloodReportRoutes from './blood-report.routes';

const router = Router();

router.use(protect);

// DNA Report routes (Coach-only)
router.use('/dna', dnaReportRoutes);

// Blood Report routes (Coach-only)
router.use('/blood', bloodReportRoutes);

export default router;
