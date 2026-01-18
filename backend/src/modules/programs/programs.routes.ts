import { Router } from 'express';
import { protect } from '../auth/auth.middleware';
import { programsController } from './programs.controller';

const router = Router();

router.use(protect);

router.post('/fitness', programsController.createFitnessProgram.bind(programsController));
router.get('/fitness', programsController.getFitnessPrograms.bind(programsController));
router.get('/fitness/:id', programsController.getFitnessProgramById.bind(programsController));
router.put('/fitness/:id', programsController.updateFitnessProgram.bind(programsController));
router.delete('/fitness/:id', programsController.deleteFitnessProgram.bind(programsController));
router.post('/fitness/:id/activate', programsController.activateFitnessProgram.bind(programsController));

export default router;
