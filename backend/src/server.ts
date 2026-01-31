import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { config } from './config';
import { errorHandler } from './utils/errorHandler';
import { logger } from './utils/logger';
import { rateLimiter } from './utils/rateLimiter';

// Import routes
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import geneticsRoutes from './modules/genetics/genetics.routes';
import biomarkersRoutes from './modules/biomarkers/biomarkers.routes';
import reportsRoutes from './modules/reports/reports.routes';
import publicDnaRoutes from './modules/reports/public-dna.routes';
import programsRoutes from './modules/programs/programs.routes';
import nutritionRoutes from './modules/nutrition/nutrition.routes';
import supplementsRoutes from './modules/supplements/supplements.routes';
import librariesRoutes from './modules/libraries/libraries.routes';
import aiCoachRoutes from './modules/ai-coach/ai-coach.routes';

dotenv.config();

const app: Application = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: config.corsOrigins,
    credentials: true,
  },
});

// Middleware
app.use(cors({ origin: config.corsOrigins, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(
  fileUpload({
    limits: { fileSize: config.maxFileSize },
    abortOnLimit: true,
    createParentPath: true,
  })
);
app.use(rateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Routes
const API_VERSION = config.apiVersion;
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);
app.use(`/api/${API_VERSION}/genetics`, geneticsRoutes);
app.use(`/api/${API_VERSION}/biomarkers`, biomarkersRoutes);
app.use(`/api/${API_VERSION}/reports`, reportsRoutes);
app.use(`/api/${API_VERSION}/public/dna`, publicDnaRoutes); // Public DNA analysis (no auth)
app.use(`/api/${API_VERSION}/programs`, programsRoutes);
app.use(`/api/${API_VERSION}/nutrition`, nutritionRoutes);
app.use(`/api/${API_VERSION}/supplements`, supplementsRoutes);
app.use(`/api/${API_VERSION}/libraries`, librariesRoutes);
app.use(`/api/${API_VERSION}/ai-coach`, aiCoachRoutes);

// Socket.IO for real-time features
io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  socket.on('join-room', (roomId: string) => {
    socket.join(roomId);
    logger.info(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// Make io available to routes
app.set('io', io);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;
httpServer.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`);
  logger.info(`📡 Environment: ${config.nodeEnv}`);
  logger.info(`🔗 API Base: /api/${API_VERSION}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  httpServer.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

export { app, io };
