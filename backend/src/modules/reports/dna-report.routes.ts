import { Router } from 'express';
import { DNAReportController } from './dna-report.controller';
import { protect, authorize } from '../auth/auth.middleware';
import { UserRole } from '@prisma/client';

const router = Router();
const controller = new DNAReportController();

// All routes require coach authentication
router.use(protect);
router.use(authorize(UserRole.COACH, UserRole.ADMIN));

// Upload and analyze DNA report
router.post('/upload', controller.uploadAndAnalyze);

// Get specific report with full details
router.get('/:reportId', controller.getReport);

// Get all reports for a client
router.get('/client/:clientId', controller.getClientReports);

// Delete a report
router.delete('/:reportId', controller.deleteReport);

// Export report as PDF
router.get('/:reportId/export/pdf', controller.exportReportPDF);

export default router;
