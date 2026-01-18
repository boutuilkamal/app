import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateSupplementProtocolData {
  clientId: string;
  name: string;
  description?: string;
  durationWeeks: number;
  recommendations: Array<{
    supplementId: string;
    dosage: string;
    form: string;
    timing: string;
    notes?: string;
  }>;
  isAiGenerated?: boolean;
  basedOnGenes?: string[];
  basedOnBiomarkers?: string[];
}

export class SupplementsService {
  async createSupplementProtocol(data: CreateSupplementProtocolData) {
    const {
      clientId,
      name,
      description,
      durationWeeks,
      recommendations,
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

    const protocol = await prisma.supplementProtocol.create({
      data: {
        clientId,
        name,
        description,
        durationWeeks,
        isAiGenerated,
        basedOnGenes,
        basedOnBiomarkers,
        recommendations: {
          create: recommendations.map((rec) => ({
            supplementId: rec.supplementId,
            dosage: rec.dosage,
            form: rec.form,
            timing: rec.timing,
            notes: rec.notes,
          })),
        },
      },
      include: {
        recommendations: {
          include: {
            supplement: true,
          },
        },
      },
    });

    return protocol;
  }

  async getSupplementProtocols(clientId?: string, coachId?: string) {
    const where: any = {};

    if (clientId) {
      where.clientId = clientId;
    } else if (coachId) {
      where.client = {
        coachId: coachId,
      };
    }

    const protocols = await prisma.supplementProtocol.findMany({
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
        recommendations: {
          include: {
            supplement: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return protocols;
  }

  async getSupplementProtocolById(id: string) {
    const protocol = await prisma.supplementProtocol.findUnique({
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
        recommendations: {
          include: {
            supplement: true,
          },
        },
      },
    });

    if (!protocol) {
      throw new Error('Protocol not found');
    }

    return protocol;
  }

  async updateSupplementProtocol(id: string, data: Partial<CreateSupplementProtocolData>) {
    const protocol = await prisma.supplementProtocol.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        durationWeeks: data.durationWeeks,
      },
      include: {
        recommendations: {
          include: {
            supplement: true,
          },
        },
      },
    });

    return protocol;
  }

  async deleteSupplementProtocol(id: string) {
    await prisma.supplementProtocol.delete({
      where: { id },
    });

    return { success: true };
  }

  async activateSupplementProtocol(id: string) {
    const protocol = await prisma.supplementProtocol.findUnique({
      where: { id },
      select: { clientId: true },
    });

    if (!protocol) {
      throw new Error('Protocol not found');
    }

    await prisma.supplementProtocol.updateMany({
      where: {
        clientId: protocol.clientId,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    const updated = await prisma.supplementProtocol.update({
      where: { id },
      data: {
        isActive: true,
        startDate: new Date(),
      },
    });

    return updated;
  }
}

export const supplementsService = new SupplementsService();
