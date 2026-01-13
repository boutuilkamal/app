import { Router } from 'express';
import { BloodReportController } from './blood-report.controller';
import { authorize } from '../auth/auth.middleware';
import { UserRole } from '@prisma/client';

const router = Router();

// All routes require coach or admin role
router.use(authorize(UserRole.COACH, UserRole.ADMIN));

// Upload and analyze blood report
router.post('/upload', BloodReportController.uploadAndAnalyze);

// Get report details
router.get('/:reportId', BloodReportController.getReport);

// Get all reports for a client
router.get('/client/:clientId', BloodReportController.getClientReports);

// Delete report
router.delete('/:reportId', BloodReportController.deleteReport);

// Export to PDF
router.get('/:reportId/export/pdf', BloodReportController.exportPDF);

// Compare two reports
router.get('/compare', BloodReportController.compareReports);

export default router;
