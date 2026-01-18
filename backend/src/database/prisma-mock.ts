// Mock Prisma client for demo purposes
export const prisma = {
  user: {
    findUnique: async (args: any) => null,
    findMany: async (args: any) => [],
    create: async (args: any) => ({ id: 'mock-id', ...args.data }),
    update: async (args: any) => ({ id: args.where.id, ...args.data }),
    delete: async (args: any) => ({ id: args.where.id }),
  },
  clientProfile: {
    findUnique: async (args: any) => null,
    findMany: async (args: any) => [],
    create: async (args: any) => ({ id: 'mock-id', ...args.data }),
  },
  coachProfile: {
    findUnique: async (args: any) => null,
    findMany: async (args: any) => [],
    create: async (args: any) => ({ id: 'mock-id', ...args.data }),
  },
  exercise: {
    findMany: async (args: any) => [],
    findUnique: async (args: any) => null,
  },
  recipe: {
    findMany: async (args: any) => [],
    findUnique: async (args: any) => null,
  },
  supplement: {
    findMany: async (args: any) => [],
    findUnique: async (args: any) => null,
  },
  fitnessProgram: {
    findMany: async (args: any) => [],
    findUnique: async (args: any) => null,
    create: async (args: any) => ({ id: 'mock-id', ...args.data }),
  },
  nutritionPlan: {
    findMany: async (args: any) => [],
    findUnique: async (args: any) => null,
  },
  supplementProtocol: {
    findMany: async (args: any) => [],
    findUnique: async (args: any) => null,
  },
  aIConversation: {
    findMany: async (args: any) => [],
    findUnique: async (args: any) => null,
    create: async (args: any) => ({ id: 'mock-id', title: 'New Chat', messages: [], ...args.data }),
  },
  aIMessage: {
    create: async (args: any) => ({ id: 'mock-id', ...args.data }),
  },
};
