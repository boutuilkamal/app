import { Router } from 'express';
import { protect } from '../auth/auth.middleware';
import prisma from '../../database/prisma';
import { AppError } from '../../utils/errorHandler';

const router = Router();

router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const { category, q, limit } = req.query as {
      category?: string;
      q?: string;
      limit?: string;
    };

    const take = limit ? Math.min(parseInt(limit, 10) || 50, 200) : 100;

    const biomarkers = await prisma.biomarkerDefinition.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: 'insensitive' } },
                { shortName: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
      take,
    });

    res.json({ success: true, data: biomarkers });
  } catch (err) {
    next(err);
  }
});

router.get('/categories', async (_req, res, next) => {
  try {
    const rows = await prisma.biomarkerDefinition.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    res.json({ success: true, data: rows.map((r) => r.category) });
  } catch (err) {
    next(err);
  }
});

router.get('/:name', async (req, res, next) => {
  try {
    const name = req.params.name;
    const biomarker = await prisma.biomarkerDefinition.findFirst({
      where: {
        OR: [
          { name: { equals: name, mode: 'insensitive' } },
          { shortName: { equals: name, mode: 'insensitive' } },
        ],
      },
    });

    if (!biomarker) throw new AppError('Biomarker not found', 404);
    res.json({ success: true, data: biomarker });
  } catch (err) {
    next(err);
  }
});

export default router;
