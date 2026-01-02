import { Router } from 'express';
import { protect } from '../auth/auth.middleware';
import prisma from '../../database/prisma';
import { AppError } from '../../utils/errorHandler';

const router = Router();

router.use(protect);

router.get('/genes', async (req, res, next) => {
  try {
    const { category, q, limit } = req.query as {
      category?: string;
      q?: string;
      limit?: string;
    };

    const take = limit ? Math.min(parseInt(limit, 10) || 50, 200) : 100;

    const genes = await prisma.geneDefinition.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(q
          ? {
              OR: [
                { symbol: { contains: q, mode: 'insensitive' } },
                { name: { contains: q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: [{ category: 'asc' }, { symbol: 'asc' }],
      take,
    });

    res.json({ success: true, data: genes });
  } catch (err) {
    next(err);
  }
});

router.get('/genes/:symbol', async (req, res, next) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const gene = await prisma.geneDefinition.findUnique({ where: { symbol } });
    if (!gene) throw new AppError('Gene not found', 404);
    res.json({ success: true, data: gene });
  } catch (err) {
    next(err);
  }
});

router.get('/categories', async (_req, res, next) => {
  try {
    const rows = await prisma.geneDefinition.findMany({
      select: { category: true },
      distinct: ['category'],
      orderBy: { category: 'asc' },
    });
    res.json({ success: true, data: rows.map((r) => r.category) });
  } catch (err) {
    next(err);
  }
});

export default router;
