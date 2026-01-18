import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SearchFilters {
  search?: string;
  category?: string;
  muscleGroup?: string;
  equipment?: string;
  difficulty?: string;
  dietTags?: string;
  tags?: string;
  limit?: number;
  offset?: number;
}

export class LibrariesService {
  // EXERCISES
  async getAllExercises(filters: SearchFilters = {}) {
    const {
      search,
      category,
      muscleGroup,
      equipment,
      difficulty,
      limit = 50,
      offset = 0,
    } = filters;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (muscleGroup) {
      where.muscleGroup = { has: muscleGroup };
    }

    if (equipment) {
      where.equipment = { has: equipment };
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    const [exercises, total] = await Promise.all([
      prisma.exercise.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.exercise.count({ where }),
    ]);

    return {
      exercises,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    };
  }

  async getExerciseById(id: string) {
    const exercise = await prisma.exercise.findUnique({
      where: { id },
    });

    if (!exercise) {
      throw new Error('Exercise not found');
    }

    return exercise;
  }

  async getExerciseCategories() {
    const exercises = await prisma.exercise.findMany({
      select: { category: true },
      distinct: ['category'],
    });
    return exercises.map((e) => e.category);
  }

  // RECIPES
  async getAllRecipes(filters: SearchFilters = {}) {
    const {
      search,
      category,
      dietTags,
      tags,
      limit = 50,
      offset = 0,
    } = filters;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (dietTags) {
      where.dietTags = { has: dietTags };
    }

    if (tags) {
      where.functionTags = { has: tags };
    }

    const [recipes, total] = await Promise.all([
      prisma.recipe.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.recipe.count({ where }),
    ]);

    return {
      recipes,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    };
  }

  async getRecipeById(id: string) {
    const recipe = await prisma.recipe.findUnique({
      where: { id },
    });

    if (!recipe) {
      throw new Error('Recipe not found');
    }

    return recipe;
  }

  async getRecipeCategories() {
    const recipes = await prisma.recipe.findMany({
      select: { category: true },
      distinct: ['category'],
    });
    return recipes.map((r) => r.category);
  }

  // SUPPLEMENTS
  async getAllSupplements(filters: SearchFilters = {}) {
    const {
      search,
      category,
      limit = 50,
      offset = 0,
    } = filters;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    const [supplements, total] = await Promise.all([
      prisma.supplement.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.supplement.count({ where }),
    ]);

    return {
      supplements,
      total,
      limit,
      offset,
      hasMore: offset + limit < total,
    };
  }

  async getSupplementById(id: string) {
    const supplement = await prisma.supplement.findUnique({
      where: { id },
    });

    if (!supplement) {
      throw new Error('Supplement not found');
    }

    return supplement;
  }

  async getSupplementCategories() {
    const supplements = await prisma.supplement.findMany({
      select: { category: true },
      distinct: ['category'],
    });
    return supplements.map((s) => s.category);
  }

  async searchAll(query: string, limit: number = 10) {
    const [exercises, recipes, supplements] = await Promise.all([
      prisma.exercise.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
      }),
      prisma.recipe.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
      }),
      prisma.supplement.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: limit,
      }),
    ]);

    return {
      exercises,
      recipes,
      supplements,
    };
  }
}

export const librariesService = new LibrariesService();
