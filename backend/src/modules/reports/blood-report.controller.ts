import { Request, Response, NextFunction } from 'express';
import { BloodReportService } from './blood-report.service';
import { AppError } from '../../utils/errors';

const bloodReportService = new BloodReportService();

export class BloodReportController {
  /**
   * Upload and analyze blood test report
   * POST /api/v1/reports/blood/upload
   */
  static async uploadAndAnalyze(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const coachId = req.user?.id;
      const { clientId } = req.body;

      if (!coachId) {
        throw new AppError('Authentication required', 401);
      }

      if (!clientId) {
        throw new AppError('Client ID is required', 400);
      }

      // Check if file exists
      if (!req.files || !req.files.file) {
        throw new AppError('No file uploaded', 400);
      }

      const file = Array.isArray(req.files.file)
        ? req.files.file[0]
        : req.files.file;

      const report = await bloodReportService.uploadAndAnalyze(
        coachId,
        clientId,
        file
      );

      res.status(200).json({
        success: true,
        data: report,
        message: 'Blood report analyzed successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get blood report details
   * GET /api/v1/reports/blood/:reportId
   */
  static async getReport(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { reportId } = req.params;

      const report = await bloodReportService.getReportWithDetails(reportId);

      res.status(200).json({
        success: true,
        data: report,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all blood reports for a client
   * GET /api/v1/reports/blood/client/:clientId
   */
  static async getClientReports(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const coachId = req.user?.id;
      const { clientId } = req.params;

      if (!coachId) {
        throw new AppError('Authentication required', 401);
      }

      const reports = await bloodReportService.getClientReports(
        coachId,
        clientId
      );

      res.status(200).json({
        success: true,
        data: reports,
        count: reports.length,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete blood report
   * DELETE /api/v1/reports/blood/:reportId
   */
  static async deleteReport(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const coachId = req.user?.id;
      const { reportId } = req.params;

      if (!coachId) {
        throw new AppError('Authentication required', 401);
      }

      await bloodReportService.deleteReport(coachId, reportId);

      res.status(200).json({
        success: true,
        message: 'Blood report deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Export blood report to PDF
   * GET /api/v1/reports/blood/:reportId/export/pdf
   */
  static async exportPDF(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { reportId } = req.params;

      const pdfBuffer = await bloodReportService.exportToPDF(reportId);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="blood-report-${reportId}.pdf"`
      );
      res.send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Compare two blood reports
   * GET /api/v1/reports/blood/compare?report1=:id1&report2=:id2
   */
  static async compareReports(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { report1, report2 } = req.query;

      if (!report1 || !report2) {
        throw new AppError('Both report IDs are required for comparison', 400);
      }

      const comparison = await bloodReportService.compareReports(
        report1 as string,
        report2 as string
      );

      res.status(200).json({
        success: true,
        data: comparison,
      });
    } catch (error) {
      next(error);
    }
  }
}
