import { logger } from '../utils/logger';

// Use mock Prisma client for demo purposes
let prisma: any;

try {
  const { PrismaClient } = require('@prisma/client');
  prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

  prisma.$connect()
    .then(() => {
      logger.info('✅ Database connected successfully');
    })
    .catch((error: any) => {
      logger.error('❌ Database connection failed:', error);
      logger.warn('🔄 Falling back to mock database for demo');
      prisma = require('./prisma-mock').prisma;
    });
} catch (error) {
  logger.warn('⚠️  Prisma client not available, using mock database for demo');
  prisma = require('./prisma-mock').prisma;
}

process.on('beforeExit', async () => {
  if (prisma.$disconnect) {
    await prisma.$disconnect();
    logger.info('Database disconnected');
  }
});

export default prisma;
