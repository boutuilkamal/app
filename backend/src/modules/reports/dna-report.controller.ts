import { Request, Response, NextFunction } from 'express';
import { DNAReportService } from './dna-report.service';
import { asyncHandler } from '../../utils/errorHandler';
import { AuthRequest } from '../auth/auth.middleware';

const dnaReportService = new DNAReportService();

export class DNAReportController {
  uploadAndAnalyze = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
      }

      const { clientId } = req.body;

      if (!req.files || !req.files.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded',
        });
      }

      const file = Array.isArray(req.files.file) ? req.files.file[0] : req.files.file;

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'text/csv',
        'text/plain',
        'image/png',
        'image/jpeg',
        'image/jpg',
      ];

      if (!allowedTypes.includes(file.mimetype)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid file type. Allowed: PDF, CSV, TXT, PNG, JPG',
        });
      }

      // Validate file size (10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        return res.status(400).json({
          success: false,
          error: 'File size exceeds 10MB limit',
        });
      }

      // Get coach profile
      const coachProfile = await this.getCoachProfile(req.user.id);

      const result = await dnaReportService.uploadAndAnalyze(
        coachProfile.id,
        clientId,
        {
          name: file.name,
          data: file.data,
          mimetype: file.mimetype,
          size: file.size,
        }
      );

      res.status(201).json({
        success: true,
        data: result,
        message: 'DNA report uploaded and analyzed successfully',
      });
    }
  );

  getReport = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
      }

      const { reportId } = req.params;

      const report = await dnaReportService.getReportWithDetails(reportId);

      res.status(200).json({
        success: true,
        data: report,
      });
    }
  );

  getClientReports = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
      }

      const { clientId } = req.params;
      const coachProfile = await this.getCoachProfile(req.user.id);

      const reports = await dnaReportService.getClientReports(
        coachProfile.id,
        clientId
      );

      res.status(200).json({
        success: true,
        data: reports,
      });
    }
  );

  deleteReport = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
      }

      const { reportId } = req.params;
      const coachProfile = await this.getCoachProfile(req.user.id);

      const result = await dnaReportService.deleteReport(coachProfile.id, reportId);

      res.status(200).json({
        success: true,
        data: result,
      });
    }
  );

  exportReportPDF = asyncHandler(
    async (req: AuthRequest, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
      }

      const { reportId } = req.params;

      const pdfBuffer = await dnaReportService.generateReportPDF(reportId);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=dna-report-${reportId}.pdf`
      );
      res.send(pdfBuffer);
    }
  );

  private async getCoachProfile(userId: string) {
    const prisma = (await import('../../database/prisma')).default;
    const coachProfile = await prisma.coachProfile.findUnique({
      where: { userId },
    });

    if (!coachProfile) {
      throw new Error('Coach profile not found');
    }

    return coachProfile;
  }
}
