import { PrismaClient, BloodReport, BloodResult } from '@prisma/client';
import axios from 'axios';
import FormData from 'form-data';
import { AppError } from '../../utils/errors';

const prisma = new PrismaClient();

interface UploadedFile {
  name: string;
  data: Buffer;
  mimetype: string;
  size: number;
}

interface BiomarkerAnalysis {
  overall_score: number;
  abnormal_count: number;
  optimal_count: number;
  summary: string;
  biomarker_results: Array<{
    name: string;
    value: number;
    unit: string;
    risk_level: 'optimal' | 'moderate' | 'critical';
    category: string;
  }>;
}

export class BloodReportService {
  private aiServiceUrl: string;

  constructor() {
    this.aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
  }

  /**
   * Upload and analyze blood test report
   * @param coachId - ID of the coach uploading
   * @param clientId - ID of the client
   * @param file - Uploaded file
   */
  async uploadAndAnalyze(
    coachId: string,
    clientId: string,
    file: UploadedFile
  ): Promise<any> {
    // Verify coach has access to client
    const coach = await prisma.coachProfile.findUnique({
      where: { id: coachId },
      include: {
        clients: {
          where: { id: clientId },
        },
      },
    });

    if (!coach || coach.clients.length === 0) {
      throw new AppError('Coach does not have access to this client', 403);
    }

    // Validate file
    this.validateFile(file);

    // Create pending report
    const report = await prisma.bloodReport.create({
      data: {
        clientId,
        fileName: file.name,
        fileUrl: '', // TODO: Upload to S3
        status: 'processing',
      },
    });

    try {
      // Send to AI service for analysis
      const analysisResult = await this.analyzeWithAI(file);

      // Save biomarker results
      await this.saveBiomarkerResults(report.id, analysisResult);

      // Update report with results
      const updatedReport = await prisma.bloodReport.update({
        where: { id: report.id },
        data: {
          status: 'completed',
          processedAt: new Date(),
          overallScore: analysisResult.overall_score,
          summary: analysisResult.summary,
          abnormalCount: analysisResult.abnormal_count,
          optimalCount: analysisResult.optimal_count,
        },
      });

      return this.getReportWithDetails(report.id);
    } catch (error) {
      // Mark as failed
      await prisma.bloodReport.update({
        where: { id: report.id },
        data: {
          status: 'failed',
          summary: `Analysis failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        },
      });

      throw new AppError('Failed to analyze blood report', 500);
    }
  }

  /**
   * Get blood report with all details
   */
  async getReportWithDetails(reportId: string): Promise<any> {
    const report = await prisma.bloodReport.findUnique({
      where: { id: reportId },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        biomarkerResults: {
          include: {
            biomarkerDefinition: true,
          },
        },
      },
    });

    if (!report) {
      throw new AppError('Blood report not found', 404);
    }

    // Group results by category
    const resultsByCategory = this.groupResultsByCategory(
      report.biomarkerResults
    );

    return {
      ...report,
      resultsByCategory,
    };
  }

  /**
   * Get all reports for a client
   */
  async getClientReports(
    coachId: string,
    clientId: string
  ): Promise<BloodReport[]> {
    // Verify access
    const coach = await prisma.coachProfile.findUnique({
      where: { id: coachId },
      include: {
        clients: {
          where: { id: clientId },
        },
      },
    });

    if (!coach || coach.clients.length === 0) {
      throw new AppError('Coach does not have access to this client', 403);
    }

    return prisma.bloodReport.findMany({
      where: { clientId },
      orderBy: { uploadedAt: 'desc' },
      include: {
        client: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  /**
   * Delete a blood report
   */
  async deleteReport(coachId: string, reportId: string): Promise<void> {
    const report = await prisma.bloodReport.findUnique({
      where: { id: reportId },
      include: {
        client: {
          include: {
            coach: true,
          },
        },
      },
    });

    if (!report) {
      throw new AppError('Blood report not found', 404);
    }

    if (report.client.coach?.id !== coachId) {
      throw new AppError('Unauthorized to delete this report', 403);
    }

    // Delete results first (cascade)
    await prisma.bloodResult.deleteMany({
      where: { reportId },
    });

    // Delete report
    await prisma.bloodReport.delete({
      where: { id: reportId },
    });
  }

  /**
   * Export report as PDF
   */
  async exportToPDF(reportId: string): Promise<Buffer> {
    const report = await this.getReportWithDetails(reportId);

    // TODO: Implement PDF generation
    // For now, return placeholder
    throw new AppError('PDF export not yet implemented', 501);
  }

  /**
   * Compare two blood reports
   */
  async compareReports(
    reportId1: string,
    reportId2: string
  ): Promise<any> {
    const report1 = await this.getReportWithDetails(reportId1);
    const report2 = await this.getReportWithDetails(reportId2);

    // Build comparison
    const comparison = {
      report1: {
        id: report1.id,
        date: report1.uploadedAt,
        overallScore: report1.overallScore,
      },
      report2: {
        id: report2.id,
        date: report2.uploadedAt,
        overallScore: report2.overallScore,
      },
      improvements: [] as string[],
      deteriorations: [] as string[],
      biomarkerComparisons: [] as any[],
    };

    // Compare each biomarker
    const biomarkers1 = new Map(
      report1.biomarkerResults.map((r: any) => [r.biomarkerDefinition.name, r])
    );
    const biomarkers2 = new Map(
      report2.biomarkerResults.map((r: any) => [r.biomarkerDefinition.name, r])
    );

    for (const [name, result2] of biomarkers2) {
      const result1 = biomarkers1.get(name);
      if (result1) {
        const change = result2.value - result1.value;
        const percentChange = ((change / result1.value) * 100).toFixed(1);

        comparison.biomarkerComparisons.push({
          name,
          value1: result1.value,
          value2: result2.value,
          change,
          percentChange,
          improved: this.isImprovement(result1, result2),
        });

        if (this.isImprovement(result1, result2)) {
          comparison.improvements.push(
            `${name} improved from ${result1.value} to ${result2.value}`
          );
        } else if (result2.riskLevel > result1.riskLevel) {
          comparison.deteriorations.push(
            `${name} worsened from ${result1.value} to ${result2.value}`
          );
        }
      }
    }

    return comparison;
  }

  // ==================== PRIVATE METHODS ====================

  /**
   * Validate uploaded file
   */
  private validateFile(file: UploadedFile): void {
    const allowedTypes = [
      'application/pdf',
      'text/csv',
      'text/plain',
      'image/png',
      'image/jpeg',
      'image/jpg',
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      throw new AppError(
        'Invalid file type. Please upload PDF, CSV, TXT, PNG, or JPG',
        400
      );
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new AppError('File size exceeds 10MB limit', 400);
    }
  }

  /**
   * Send file to AI service for analysis
   */
  private async analyzeWithAI(file: UploadedFile): Promise<BiomarkerAnalysis> {
    try {
      const formData = new FormData();
      formData.append('file', file.data, {
        filename: file.name,
        contentType: file.mimetype,
      });

      const response = await axios.post(
        `${this.aiServiceUrl}/api/v1/analyze/blood`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
          timeout: 120000, // 2 minutes
        }
      );

      return response.data;
    } catch (error) {
      console.error('AI analysis error:', error);
      throw new AppError('Failed to analyze blood report with AI', 500);
    }
  }

  /**
   * Save biomarker results to database
   */
  private async saveBiomarkerResults(
    reportId: string,
    analysis: BiomarkerAnalysis
  ): Promise<void> {
    for (const result of analysis.biomarker_results) {
      // Find or create biomarker definition
      let biomarkerDef = await prisma.biomarkerDefinition.findUnique({
        where: { name: result.name },
      });

      if (!biomarkerDef) {
        // Create basic definition
        biomarkerDef = await prisma.biomarkerDefinition.create({
          data: {
            name: result.name,
            shortName: result.name,
            category: result.category,
            unit: result.unit,
            function: '',
            optimalMin: 0,
            optimalMax: 0,
            moderateMin: 0,
            moderateMax: 0,
            criticalMin: 0,
            criticalMax: 0,
            recommendations: {},
          },
        });
      }

      // Create blood result
      await prisma.bloodResult.create({
        data: {
          reportId,
          biomarkerId: biomarkerDef.id,
          value: result.value,
          unit: result.unit,
          riskLevel: result.risk_level,
        },
      });
    }
  }

  /**
   * Group results by category
   */
  private groupResultsByCategory(results: any[]): any {
    const grouped: any = {};

    for (const result of results) {
      const category = result.biomarkerDefinition.category;
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(result);
    }

    return grouped;
  }

  /**
   * Check if biomarker improved between reports
   */
  private isImprovement(result1: any, result2: any): boolean {
    const riskLevels = ['optimal', 'moderate', 'critical'];
    const level1 = riskLevels.indexOf(result1.riskLevel);
    const level2 = riskLevels.indexOf(result2.riskLevel);
    return level2 < level1; // Lower index = better
  }
}
