import { Router } from 'express';
import { protect } from '../auth/auth.middleware';

const router = Router();

router.use(protect);

router.get('/exercises', (_req, res) => {
  res.json({ success: true, message: 'Get all exercises' });
});

router.get('/exercises/:id', (_req, res) => {
  res.json({ success: true, message: 'Get exercise details' });
});

router.get('/recipes', (_req, res) => {
  res.json({ success: true, message: 'Get all recipes' });
});

router.get('/recipes/:id', (_req, res) => {
  res.json({ success: true, message: 'Get recipe details' });
});

router.get('/supplements', (_req, res) => {
  res.json({ success: true, message: 'Get all supplements' });
});

router.get('/supplements/:id', (_req, res) => {
  res.json({ success: true, message: 'Get supplement details' });
});

export default router;
