import { Router } from 'express';
import { protect } from '../auth/auth.middleware';
import { librariesController } from './libraries.controller';

const router = Router();

router.use(protect);

// Search all
router.get('/search', librariesController.searchAll.bind(librariesController));

// Exercises
router.get('/exercises/categories', librariesController.getExerciseCategories.bind(librariesController));
router.get('/exercises/:id', librariesController.getExerciseById.bind(librariesController));
router.get('/exercises', librariesController.getAllExercises.bind(librariesController));

// Recipes
router.get('/recipes/categories', librariesController.getRecipeCategories.bind(librariesController));
router.get('/recipes/:id', librariesController.getRecipeById.bind(librariesController));
router.get('/recipes', librariesController.getAllRecipes.bind(librariesController));

// Supplements
router.get('/supplements/categories', librariesController.getSupplementCategories.bind(librariesController));
router.get('/supplements/:id', librariesController.getSupplementById.bind(librariesController));
router.get('/supplements', librariesController.getAllSupplements.bind(librariesController));

export default router;
