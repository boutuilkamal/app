import { Router } from 'express';
import { protect } from '../auth/auth.middleware';
import { nutritionController } from './nutrition.controller';

const router = Router();

router.use(protect);

router.post('/plans', nutritionController.createNutritionPlan.bind(nutritionController));
router.get('/plans', nutritionController.getNutritionPlans.bind(nutritionController));
router.get('/plans/:id', nutritionController.getNutritionPlanById.bind(nutritionController));
router.put('/plans/:id', nutritionController.updateNutritionPlan.bind(nutritionController));
router.delete('/plans/:id', nutritionController.deleteNutritionPlan.bind(nutritionController));
router.post('/plans/:id/activate', nutritionController.activateNutritionPlan.bind(nutritionController));

export default router;
