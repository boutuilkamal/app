import { PrismaClient, ProgramType } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateFitnessProgramData {
  clientId: string;
  name: string;
  description?: string;
  type: ProgramType;
  durationWeeks: number;
  workouts: Array<{
    name: string;
    description?: string;
    dayOfWeek: number;
    exercises: Array<{
      exerciseId: string;
      sets: number;
      reps: string;
      tempo?: string;
      restSeconds: number;
      notes?: string;
    }>;
  }>;
  isAiGenerated?: boolean;
  basedOnGenes?: string[];
  basedOnBiomarkers?: string[];
}

export class ProgramsService {
  async createFitnessProgram(data: CreateFitnessProgramData) {
    const {
      clientId,
      name,
      description,
      type,
      durationWeeks,
      workouts,
      isAiGenerated = false,
      basedOnGenes = [],
      basedOnBiomarkers = [],
    } = data;

    // Verify client exists
    const client = await prisma.clientProfile.findUnique({
      where: { id: clientId },
    });

    if (!client) {
      throw new Error('Client not found');
    }

    // Create program with workouts
    const program = await prisma.fitnessProgram.create({
      data: {
        clientId,
        name,
        description,
        type,
        durationWeeks,
        isAiGenerated,
        basedOnGenes,
        basedOnBiomarkers,
        workouts: {
          create: workouts.map((workout) => ({
            name: workout.name,
            description: workout.description,
            dayOfWeek: workout.dayOfWeek,
            orderIndex: workout.dayOfWeek,
            exercises: {
              create: workout.exercises.map((exercise, index) => ({
                exerciseId: exercise.exerciseId,
                orderIndex: index,
                sets: exercise.sets,
                reps: exercise.reps,
                tempo: exercise.tempo,
                restSeconds: exercise.restSeconds,
                notes: exercise.notes,
              })),
            },
          })),
        },
      },
      include: {
        workouts: {
          include: {
            exercises: {
              include: {
                exercise: true,
              },
            },
          },
        },
      },
    });

    return program;
  }

  async getFitnessPrograms(clientId?: string, coachId?: string) {
    const where: any = {};

    if (clientId) {
      where.clientId = clientId;
    } else if (coachId) {
      where.client = {
        coachId: coachId,
      };
    }

    const programs = await prisma.fitnessProgram.findMany({
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
        workouts: {
          include: {
            exercises: {
              include: {
                exercise: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return programs;
  }

  async getFitnessProgramById(id: string) {
    const program = await prisma.fitnessProgram.findUnique({
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
        workouts: {
          include: {
            exercises: {
              include: {
                exercise: true,
              },
              orderBy: {
                orderIndex: 'asc',
              },
            },
          },
          orderBy: {
            orderIndex: 'asc',
          },
        },
      },
    });

    if (!program) {
      throw new Error('Program not found');
    }

    return program;
  }

  async updateFitnessProgram(id: string, data: Partial<CreateFitnessProgramData>) {
    const program = await prisma.fitnessProgram.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
        durationWeeks: data.durationWeeks,
        isActive: data.isActive !== undefined ? data.isActive : undefined,
      },
      include: {
        workouts: {
          include: {
            exercises: {
              include: {
                exercise: true,
              },
            },
          },
        },
      },
    });

    return program;
  }

  async deleteFitnessProgram(id: string) {
    await prisma.fitnessProgram.delete({
      where: { id },
    });

    return { success: true };
  }

  async activateFitnessProgram(id: string) {
    // Deactivate all other programs for this client
    const program = await prisma.fitnessProgram.findUnique({
      where: { id },
      select: { clientId: true },
    });

    if (!program) {
      throw new Error('Program not found');
    }

    await prisma.fitnessProgram.updateMany({
      where: {
        clientId: program.clientId,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    // Activate this program
    const updated = await prisma.fitnessProgram.update({
      where: { id },
      data: {
        isActive: true,
        startDate: new Date(),
      },
    });

    return updated;
  }
}

export const programsService = new ProgramsService();
