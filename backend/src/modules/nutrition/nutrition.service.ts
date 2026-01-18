import { PrismaClient, DietType } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateNutritionPlanData {
  clientId: string;
  name: string;
  description?: string;
  dietType: DietType;
  dailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  durationWeeks: number;
  mealPlans: Array<{
    name: string;
    description?: string;
    dayOfWeek: number;
    meals: Array<{
      name: string;
      timeOfDay: string;
      recipes: Array<{
        recipeId: string;
        servings: number;
      }>;
    }>;
  }>;
  isAiGenerated?: boolean;
  basedOnGenes?: string[];
  basedOnBiomarkers?: string[];
}

export class NutritionService {
  async createNutritionPlan(data: CreateNutritionPlanData) {
    const {
      clientId,
      name,
      description,
      dietType,
      dailyCalories,
      proteinGrams,
      carbsGrams,
      fatGrams,
      durationWeeks,
      mealPlans,
      isAiGenerated = false,
      basedOnGenes = [],
      basedOnBiomarkers = [],
    } = data;

    const client = await prisma.clientProfile.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new Error('Client not found');
    }

    const plan = await prisma.nutritionPlan.create({
      data: {
        clientId,
        name,
        description,
        dietType,
        dailyCalories,
        proteinGrams,
        carbsGrams,
        fatGrams,
        durationWeeks,
        isAiGenerated,
        basedOnGenes,
        basedOnBiomarkers,
        mealPlans: {
          create: mealPlans.map((mealPlan) => ({
            name: mealPlan.name,
            description: mealPlan.description,
            dayOfWeek: mealPlan.dayOfWeek,
            meals: {
              create: mealPlan.meals.map((meal, index) => ({
                name: meal.name,
                timeOfDay: meal.timeOfDay,
                orderIndex: index,
                recipes: {
                  create: meal.recipes.map((recipe) => ({
                    recipeId: recipe.recipeId,
                    servings: recipe.servings,
                  })),
                },
              })),
            },
          })),
        },
      },
      include: {
        mealPlans: {
          include: {
            meals: {
              include: {
                recipes: {
                  include: {
                    recipe: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return plan;
  }

  async getNutritionPlans(clientId?: string, coachId?: string) {
    const where: any = {};

    if (clientId) {
      where.clientId = clientId;
    } else if (coachId) {
      where.client = {
        coachId: coachId,
      };
    }

    const plans = await prisma.nutritionPlan.findMany({
      where,
      include: {
        client: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        mealPlans: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return plans;
  }

  async getNutritionPlanById(id: string) {
    const plan = await prisma.nutritionPlan.findUnique({
      where: { id },
      include: {
        client: {
          include: {
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        mealPlans: {
          include: {
            meals: {
              include: {
                recipes: {
                  include: {
                    recipe: true,
                  },
                },
              },
              orderBy: {
                orderIndex: 'asc',
              },
            },
          },
        },
      },
    });

    if (!plan) {
      throw new Error('Nutrition plan not found');
    }

    return plan;
  }

  async updateNutritionPlan(id: string, data: Partial<CreateNutritionPlanData>) {
    const plan = await prisma.nutritionPlan.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        dietType: data.dietType,
        dailyCalories: data.dailyCalories,
        proteinGrams: data.proteinGrams,
        carbsGrams: data.carbsGrams,
        fatGrams: data.fatGrams,
        durationWeeks: data.durationWeeks,
      },
      include: {
        mealPlans: true,
      },
    });

    return plan;
  }

  async deleteNutritionPlan(id: string) {
    await prisma.nutritionPlan.delete({
      where: { id },
    });

    return { success: true };
  }

  async activateNutritionPlan(id: string) {
    const plan = await prisma.nutritionPlan.findUnique({
      where: { id },
      select: { clientId: true },
    });

    if (!plan) {
      throw new Error('Plan not found');
    }

    await prisma.nutritionPlan.updateMany({
      where: {
        clientId: plan.clientId,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    const updated = await prisma.nutritionPlan.update({
      where: { id },
      data: {
        isActive: true,
        startDate: new Date(),
      },
    });

    return updated;
  }
}

export const nutritionService = new NutritionService();
