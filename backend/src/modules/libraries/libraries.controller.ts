import { Request, Response } from 'express';
import { librariesService } from './libraries.service';

export class LibrariesController {
  // EXERCISES
  async getAllExercises(req: Request, res: Response) {
    try {
      const filters = {
        search: req.query.search as string,
        category: req.query.category as string,
        muscleGroup: req.query.muscleGroup as string,
        equipment: req.query.equipment as string,
        difficulty: req.query.difficulty as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      };

      const result = await librariesService.getAllExercises(filters);

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch exercises',
      });
    }
  }

  async getExerciseById(req: Request, res: Response) {
    try {
      const exercise = await librariesService.getExerciseById(req.params.id);

      res.json({
        success: true,
        data: exercise,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Exercise not found',
      });
    }
  }

  async getExerciseCategories(req: Request, res: Response) {
    try {
      const categories = await librariesService.getExerciseCategories();

      res.json({
        success: true,
        data: categories,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch categories',
      });
    }
  }

  // RECIPES
  async getAllRecipes(req: Request, res: Response) {
    try {
      const filters = {
        search: req.query.search as string,
        category: req.query.category as string,
        dietTags: req.query.dietTags as string,
        tags: req.query.tags as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      };

      const result = await librariesService.getAllRecipes(filters);

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch recipes',
      });
    }
  }

  async getRecipeById(req: Request, res: Response) {
    try {
      const recipe = await librariesService.getRecipeById(req.params.id);

      res.json({
        success: true,
        data: recipe,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Recipe not found',
      });
    }
  }

  async getRecipeCategories(req: Request, res: Response) {
    try {
      const categories = await librariesService.getRecipeCategories();

      res.json({
        success: true,
        data: categories,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch categories',
      });
    }
  }

  // SUPPLEMENTS
  async getAllSupplements(req: Request, res: Response) {
    try {
      const filters = {
        search: req.query.search as string,
        category: req.query.category as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
        offset: req.query.offset ? parseInt(req.query.offset as string) : 0,
      };

      const result = await librariesService.getAllSupplements(filters);

      res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch supplements',
      });
    }
  }

  async getSupplementById(req: Request, res: Response) {
    try {
      const supplement = await librariesService.getSupplementById(req.params.id);

      res.json({
        success: true,
        data: supplement,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || 'Supplement not found',
      });
    }
  }

  async getSupplementCategories(req: Request, res: Response) {
    try {
      const categories = await librariesService.getSupplementCategories();

      res.json({
        success: true,
        data: categories,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch categories',
      });
    }
  }

  // SEARCH ALL
  async searchAll(req: Request, res: Response) {
    try {
      const query = req.query.q as string;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;

      if (!query) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required',
        });
      }

      const results = await librariesService.searchAll(query, limit);

      res.json({
        success: true,
        data: results,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Search failed',
      });
    }
  }
}

export const librariesController = new LibrariesController();
