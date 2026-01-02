import { Router } from 'express';
import multer from 'multer';
import prisma from '../../database/prisma';
import { protect, AuthRequest } from '../auth/auth.middleware';
import { AppError } from '../../utils/errorHandler';
import {
  extractTextFromUpload,
  parseBiomarkersFromText,
  parseGeneticVariantsFromText,
  riskForBiomarker,
  riskForGene,
  riskLevelToTraffic,
  scoreFromRisk,
} from './report.utils';
import { RiskLevel, UserRole } from '@prisma/client';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.use(protect);

async function resolveClientProfileId(req: AuthRequest, requestedClientId?: string): Promise<string> {
  if (!req.user) throw new AppError('Not authorized', 401);

  if (req.user.role === UserRole.CLIENT) {
    const client = await prisma.clientProfile.findUnique({ where: { userId: req.user.id } });
    if (!client) throw new AppError('Client profile not found', 404);
    return client.id;
  }

  if (!requestedClientId) throw new AppError('clientId is required for coaches/admins', 400);

  if (req.user.role === UserRole.ADMIN) {
    const client = await prisma.clientProfile.findUnique({ where: { id: requestedClientId } });
    if (!client) throw new AppError('Client profile not found', 404);
    return client.id;
  }

  // COACH
  const coach = await prisma.coachProfile.findUnique({ where: { userId: req.user.id } });
  if (!coach) throw new AppError('Coach profile not found', 404);

  const client = await prisma.clientProfile.findUnique({ where: { id: requestedClientId } });
  if (!client) throw new AppError('Client profile not found', 404);
  if (client.coachId !== coach.id) throw new AppError('Forbidden - client not assigned to this coach', 403);

  return client.id;
}

router.post('/genetic/upload', upload.single('file'), async (req: AuthRequest, res, next) => {
  try {
    if (!req.file) throw new AppError('Missing file upload (field name: file)', 400);

    const clientId = await resolveClientProfileId(req, (req.body?.clientId as string | undefined) || undefined);

    const text = await extractTextFromUpload(req.file.buffer, req.file.mimetype);
    const parsed = parseGeneticVariantsFromText(text);
    const defs = await prisma.geneDefinition.findMany({ orderBy: { symbol: 'asc' } });

    const bySymbol = new Map(parsed.map((p) => [p.symbol.toUpperCase(), p.variant]));

    const computed = defs.map((def) => {
      const variant = bySymbol.get(def.symbol.toUpperCase());
      const risk = riskForGene(def, variant);
      return {
        gene: {
          symbol: def.symbol,
          name: def.name,
          category: def.category,
          function: def.function,
          recommendations: def.recommendations,
        },
        variant: variant ?? null,
        riskLevel: risk,
        traffic: riskLevelToTraffic(risk),
      };
    });

    const scored = computed.filter((c) => c.variant);
    const overallScore =
      scored.length > 0 ? (scored.reduce((sum, c) => sum + scoreFromRisk(c.riskLevel), 0) / scored.length) * 100 : 0;

    const strengths = scored
      .filter((c) => c.riskLevel === RiskLevel.OPTIMAL)
      .slice(0, 6)
      .map((c) => c.gene.symbol);
    const risks = scored
      .filter((c) => c.riskLevel === RiskLevel.HIGH)
      .slice(0, 6)
      .map((c) => c.gene.symbol);

    const report = await prisma.geneticReport.create({
      data: {
        clientId,
        fileName: req.file.originalname || 'genetic-report',
        fileUrl: `local://uploads/${Date.now()}-${req.file.originalname || 'genetic-report'}`,
        processedAt: new Date(),
        status: 'processed',
        overallScore,
        strengths,
        risks,
        summary:
          scored.length === 0
            ? 'No gene variants were detected. Upload a CSV/TXT with rows like: SYMBOL,VARIANT (e.g. FTO,AA).'
            : 'Genetic report processed. Review category-level patterns and focus interventions on orange/red items.',
      },
    });

    const resultsToCreate = computed
      .filter((c) => c.variant)
      .map((c) => ({
        reportId: report.id,
        geneId: defs.find((d) => d.symbol === c.gene.symbol)!.id,
        variant: c.variant!,
        riskLevel: c.riskLevel,
        notes: null as string | null,
      }));

    if (resultsToCreate.length > 0) {
      await prisma.geneResult.createMany({ data: resultsToCreate, skipDuplicates: true });
    }

    res.json({
      success: true,
      data: {
        report,
        table: computed,
        detectedCount: scored.length,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post('/blood/upload', upload.single('file'), async (req: AuthRequest, res, next) => {
  try {
    if (!req.file) throw new AppError('Missing file upload (field name: file)', 400);

    const clientId = await resolveClientProfileId(req, (req.body?.clientId as string | undefined) || undefined);
    const testDateRaw = (req.body?.testDate as string | undefined) || undefined;
    const testDate = testDateRaw ? new Date(testDateRaw) : new Date();
    if (Number.isNaN(testDate.getTime())) throw new AppError('Invalid testDate (expected ISO date)', 400);

    const text = await extractTextFromUpload(req.file.buffer, req.file.mimetype);
    const parsed = parseBiomarkersFromText(text);
    const defs = await prisma.biomarkerDefinition.findMany({ orderBy: { name: 'asc' } });

    const byKey = new Map(parsed.map((p) => [p.nameOrShortName.toLowerCase(), p]));

    const computed = defs.map((def) => {
      const hit =
        byKey.get(def.name.toLowerCase()) ||
        byKey.get(def.shortName.toLowerCase()) ||
        byKey.get(def.shortName.replace(/\s/g, '').toLowerCase());
      const value = hit?.value;
      const unit = hit?.unit || def.unit;
      const risk = riskForBiomarker(def, value);
      return {
        biomarker: {
          name: def.name,
          shortName: def.shortName,
          category: def.category,
          unit: def.unit,
          function: def.function,
          interventions: def.interventions,
        },
        value: value ?? null,
        unit,
        riskLevel: risk,
        traffic: riskLevelToTraffic(risk),
      };
    });

    const scored = computed.filter((c) => c.value !== null);
    const overallScore =
      scored.length > 0 ? (scored.reduce((sum, c) => sum + scoreFromRisk(c.riskLevel), 0) / scored.length) * 100 : 0;

    const optimalCount = scored.filter((c) => c.riskLevel === RiskLevel.OPTIMAL).length;
    const borderlineCount = scored.filter((c) => c.riskLevel === RiskLevel.MODERATE).length;
    const criticalCount = scored.filter((c) => c.riskLevel === RiskLevel.HIGH).length;

    const report = await prisma.bloodReport.create({
      data: {
        clientId,
        fileName: req.file.originalname || 'blood-report',
        fileUrl: `local://uploads/${Date.now()}-${req.file.originalname || 'blood-report'}`,
        testDate,
        uploadedAt: new Date(),
        processedAt: new Date(),
        status: 'processed',
        overallScore,
        optimalCount,
        borderlineCount,
        criticalCount,
        summary:
          scored.length === 0
            ? 'No biomarker values were detected. Upload a CSV/TXT with rows like: NAME,VALUE,UNIT (e.g. Fasting Glucose,92,mg/dL).'
            : 'Blood report processed. Prioritize red items first, then address borderline markers with targeted lifestyle and supplementation.',
      },
    });

    const resultsToCreate = computed
      .filter((c) => c.value !== null)
      .map((c) => {
        const def = defs.find((d) => d.name === c.biomarker.name)!;
        return {
          reportId: report.id,
          biomarkerId: def.id,
          value: c.value as number,
          unit: c.unit,
          riskLevel: c.riskLevel,
          notes: null as string | null,
        };
      });

    if (resultsToCreate.length > 0) {
      await prisma.biomarkerResult.createMany({ data: resultsToCreate, skipDuplicates: true });
    }

    res.json({
      success: true,
      data: {
        report,
        table: computed,
        detectedCount: scored.length,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get('/genetic', async (req: AuthRequest, res, next) => {
  try {
    const clientId = await resolveClientProfileId(req, (req.query?.clientId as string | undefined) || undefined);
    const reports = await prisma.geneticReport.findMany({
      where: { clientId },
      orderBy: { uploadedAt: 'desc' },
      select: {
        id: true,
        fileName: true,
        status: true,
        uploadedAt: true,
        processedAt: true,
        overallScore: true,
        strengths: true,
        risks: true,
      },
    });
    res.json({ success: true, data: reports });
  } catch (err) {
    next(err);
  }
});

router.get('/blood', async (req: AuthRequest, res, next) => {
  try {
    const clientId = await resolveClientProfileId(req, (req.query?.clientId as string | undefined) || undefined);
    const reports = await prisma.bloodReport.findMany({
      where: { clientId },
      orderBy: { uploadedAt: 'desc' },
      select: {
        id: true,
        fileName: true,
        status: true,
        testDate: true,
        uploadedAt: true,
        processedAt: true,
        overallScore: true,
        optimalCount: true,
        borderlineCount: true,
        criticalCount: true,
      },
    });
    res.json({ success: true, data: reports });
  } catch (err) {
    next(err);
  }
});

router.get('/genetic/:id', async (req: AuthRequest, res, next) => {
  try {
    const clientId = await resolveClientProfileId(req, (req.query?.clientId as string | undefined) || undefined);
    const reportId = req.params.id;

    const report = await prisma.geneticReport.findFirst({
      where: { id: reportId, clientId },
      include: { geneResults: { include: { geneDefinition: true } } },
    });
    if (!report) throw new AppError('Report not found', 404);

    const defs = await prisma.geneDefinition.findMany({ orderBy: { symbol: 'asc' } });
    const bySymbol = new Map(report.geneResults.map((r) => [r.geneDefinition.symbol, r.variant]));

    const table = defs.map((def) => {
      const variant = bySymbol.get(def.symbol) ?? null;
      const risk = riskForGene(def, variant ?? undefined);
      return {
        gene: {
          symbol: def.symbol,
          name: def.name,
          category: def.category,
          function: def.function,
          recommendations: def.recommendations,
        },
        variant,
        riskLevel: risk,
        traffic: riskLevelToTraffic(risk),
      };
    });

    res.json({ success: true, data: { report, table } });
  } catch (err) {
    next(err);
  }
});

router.get('/blood/:id', async (req: AuthRequest, res, next) => {
  try {
    const clientId = await resolveClientProfileId(req, (req.query?.clientId as string | undefined) || undefined);
    const reportId = req.params.id;

    const report = await prisma.bloodReport.findFirst({
      where: { id: reportId, clientId },
      include: { biomarkerResults: { include: { biomarkerDef: true } } },
    });
    if (!report) throw new AppError('Report not found', 404);

    const defs = await prisma.biomarkerDefinition.findMany({ orderBy: { name: 'asc' } });
    const byName = new Map(report.biomarkerResults.map((r) => [r.biomarkerDef.name, r]));

    const table = defs.map((def) => {
      const r = byName.get(def.name);
      const value = r?.value ?? null;
      const unit = r?.unit ?? def.unit;
      const risk = riskForBiomarker(def, value ?? undefined);
      return {
        biomarker: {
          name: def.name,
          shortName: def.shortName,
          category: def.category,
          unit: def.unit,
          function: def.function,
          interventions: def.interventions,
        },
        value,
        unit,
        riskLevel: risk,
        traffic: riskLevelToTraffic(risk),
      };
    });

    res.json({ success: true, data: { report, table } });
  } catch (err) {
    next(err);
  }
});

export default router;
