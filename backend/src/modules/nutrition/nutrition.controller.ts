import { Request, Response } from 'express';
import { nutritionService } from './nutrition.service';

export class NutritionController {
  async createNutritionPlan(req: Request, res: Response) {
    try {
      const plan = await nutritionService.createNutritionPlan(req.body);

      res.status(201).json({
        success: true,
        data: plan,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to create nutrition plan',
      });
    }
  }

  async getNutritionPlans(req: Request, res: Response) {
    try {
      const clientId = req.query.clientId as string;
      const coachId = req.query.coachId as string;

      const plans = await nutritionService.getNutritionPlans(clientId, coachId);

      res.json({
        success: true,
        data: plans,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch plans',
      });
    }
  }

  async getNutritionPlanById(req: Request, res: Response) {
    try {
      const plan = await nutritionService.getNutritionPlanById(req.params.id);

      res.json({
        success: true,
        data: plan,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Plan not found',
      });
    }
  }

  async updateNutritionPlan(req: Request, res: Response) {
    try {
      const plan = await nutritionService.updateNutritionPlan(req.params.id, req.body);

      res.json({
        success: true,
        data: plan,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to update plan',
      });
    }
  }

  async deleteNutritionPlan(req: Request, res: Response) {
    try {
      await nutritionService.deleteNutritionPlan(req.params.id);

      res.json({
        success: true,
        message: 'Plan deleted successfully',
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to delete plan',
      });
    }
  }

  async activateNutritionPlan(req: Request, res: Response) {
    try {
      const plan = await nutritionService.activateNutritionPlan(req.params.id);

      res.json({
        success: true,
        data: plan,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || 'Failed to activate plan',
      });
    }
  }
}

export const nutritionController = new NutritionController();
