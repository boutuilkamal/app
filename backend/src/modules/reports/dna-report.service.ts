import prisma from '../../database/prisma';
import { AppError } from '../../utils/errorHandler';
import axios from 'axios';
import { config } from '../../config';

interface UploadedFile {
  name: string;
  data: Buffer;
  mimetype: string;
  size: number;
}

interface GeneVariantResult {
  geneSymbol: string;
  variant: string;
  riskLevel: 'optimal' | 'moderate' | 'highRisk';
}

interface DNAAnalysisResult {
  overallScore: number;
  strengths: string[];
  risks: string[];
  geneResults: GeneVariantResult[];
  summary: string;
}

export class DNAReportService {
  private aiServiceUrl = config.aiServiceUrl;

  async uploadAndAnalyze(
    coachId: string,
    clientId: string,
    file: UploadedFile
  ) {
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

    // Create pending report
    const report = await prisma.geneticReport.create({
      data: {
        clientId,
        fileName: file.name,
        fileUrl: '', // Will be updated after storage
        status: 'processing',
      },
    });

    try {
      // Send file to AI service for analysis
      const analysisResult = await this.analyzeWithAI(file);

      // Process and save results
      await this.saveAnalysisResults(report.id, analysisResult);

      // Update report status
      await prisma.geneticReport.update({
        where: { id: report.id },
        data: {
          status: 'completed',
          processedAt: new Date(),
          overallScore: analysisResult.overallScore,
          summary: analysisResult.summary,
          strengths: analysisResult.strengths,
          risks: analysisResult.risks,
        },
      });

      return this.getReportWithDetails(report.id);
    } catch (error) {
      // Update report status to failed
      await prisma.geneticReport.update({
        where: { id: report.id },
        data: {
          status: 'failed',
        },
      });

      throw new AppError(
        `Failed to analyze DNA report: ${error instanceof Error ? error.message : 'Unknown error'}`,
        500
      );
    }
  }

  private async analyzeWithAI(file: UploadedFile): Promise<DNAAnalysisResult> {
    const formData = new FormData();
    const blob = new Blob([file.data], { type: file.mimetype });
    formData.append('file', blob, file.name);

    try {
      const response = await axios.post(
        `${this.aiServiceUrl}/api/v1/analyze/genetic`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 60000, // 60 seconds
        }
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new AppError(
          `AI Service error: ${error.response?.data?.detail || error.message}`,
          error.response?.status || 500
        );
      }
      throw error;
    }
  }

  private async saveAnalysisResults(
    reportId: string,
    analysis: DNAAnalysisResult
  ) {
    // Get all gene definitions
    const geneDefinitions = await prisma.geneDefinition.findMany();
    const geneMap = new Map(geneDefinitions.map((g) => [g.symbol, g]));

    // Save gene results
    for (const result of analysis.geneResults) {
      const geneDefinition = geneMap.get(result.geneSymbol);
      if (!geneDefinition) {
        console.warn(`Gene definition not found for: ${result.geneSymbol}`);
        continue;
      }

      await prisma.geneResult.create({
        data: {
          reportId,
          geneId: geneDefinition.id,
          variant: result.variant,
          riskLevel: result.riskLevel.toUpperCase() as any,
        },
      });
    }
  }

  async getReportWithDetails(reportId: string) {
    const report = await prisma.geneticReport.findUnique({
      where: { id: reportId },
      include: {
        client: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        geneResults: {
          include: {
            geneDefinition: true,
          },
          orderBy: {
            geneDefinition: {
              category: 'asc',
            },
          },
        },
      },
    });

    if (!report) {
      throw new AppError('Report not found', 404);
    }

    return this.formatReportResponse(report);
  }

  private formatReportResponse(report: any) {
    // Group gene results by category
    const resultsByCategory: Record<string, any[]> = {};

    for (const result of report.geneResults) {
      const category = result.geneDefinition.category;
      if (!resultsByCategory[category]) {
        resultsByCategory[category] = [];
      }

      resultsByCategory[category].push({
        id: result.id,
        gene: {
          symbol: result.geneDefinition.symbol,
          name: result.geneDefinition.name,
          function: result.geneDefinition.function,
        },
        variant: result.variant,
        riskLevel: result.riskLevel,
        color: this.getRiskColor(result.riskLevel),
        recommendations: this.getRecommendations(
          result.geneDefinition,
          result.riskLevel
        ),
      });
    }

    // Calculate category scores
    const categoryScores: Record<string, any> = {};
    for (const [category, results] of Object.entries(resultsByCategory)) {
      const optimalCount = results.filter((r) => r.riskLevel === 'OPTIMAL').length;
      const moderateCount = results.filter((r) => r.riskLevel === 'MODERATE').length;
      const highRiskCount = results.filter((r) => r.riskLevel === 'HIGH').length;

      categoryScores[category] = {
        optimal: optimalCount,
        moderate: moderateCount,
        highRisk: highRiskCount,
        total: results.length,
        score: (optimalCount * 100 + moderateCount * 50) / results.length,
      };
    }

    return {
      id: report.id,
      client: {
        id: report.client.id,
        name: `${report.client.user.firstName} ${report.client.user.lastName}`,
        email: report.client.user.email,
      },
      fileName: report.fileName,
      uploadedAt: report.uploadedAt,
      processedAt: report.processedAt,
      status: report.status,
      overallScore: report.overallScore,
      summary: report.summary,
      strengths: report.strengths,
      risks: report.risks,
      categorizedResults: resultsByCategory,
      categoryScores,
      totalGenes: report.geneResults.length,
      trafficLight: {
        green: report.geneResults.filter((r: any) => r.riskLevel === 'OPTIMAL').length,
        orange: report.geneResults.filter((r: any) => r.riskLevel === 'MODERATE')
          .length,
        red: report.geneResults.filter((r: any) => r.riskLevel === 'HIGH').length,
      },
    };
  }

  private getRiskColor(riskLevel: string): string {
    switch (riskLevel) {
      case 'OPTIMAL':
        return '#10b981'; // green
      case 'MODERATE':
        return '#f59e0b'; // orange
      case 'HIGH':
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  }

  private getRecommendations(geneDefinition: any, riskLevel: string): string[] {
    const recommendations = geneDefinition.recommendations as any;
    const level = riskLevel.toLowerCase();

    if (recommendations && recommendations[level]) {
      return recommendations[level];
    }

    return [];
  }

  async getClientReports(coachId: string, clientId: string) {
    // Verify coach has access
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

    const reports = await prisma.geneticReport.findMany({
      where: { clientId },
      orderBy: { uploadedAt: 'desc' },
      include: {
        geneResults: true,
      },
    });

    return reports.map((report) => ({
      id: report.id,
      fileName: report.fileName,
      uploadedAt: report.uploadedAt,
      processedAt: report.processedAt,
      status: report.status,
      overallScore: report.overallScore,
      geneCount: report.geneResults.length,
    }));
  }

  async deleteReport(coachId: string, reportId: string) {
    const report = await prisma.geneticReport.findUnique({
      where: { id: reportId },
      include: {
        client: {
          select: {
            coachId: true,
          },
        },
      },
    });

    if (!report) {
      throw new AppError('Report not found', 404);
    }

    if (report.client.coachId !== coachId) {
      throw new AppError('Not authorized to delete this report', 403);
    }

    await prisma.geneticReport.delete({
      where: { id: reportId },
    });

    return { message: 'Report deleted successfully' };
  }

  async generateReportPDF(reportId: string): Promise<Buffer> {
    const report = await this.getReportWithDetails(reportId);

    // TODO: Implement PDF generation using a library like PDFKit or Puppeteer
    // For now, return a placeholder
    const pdfContent = JSON.stringify(report, null, 2);
    return Buffer.from(pdfContent);
  }
}
