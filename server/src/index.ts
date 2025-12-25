console.log('🔍 [DEBUG] Starting server initialization...');
import dotenv from 'dotenv';
dotenv.config();
console.log('🔍 [DEBUG] Environment variables loaded.');

import express from 'express';
import clientRoutes from './routes/clients';
import calendarRoutes from './routes/calendar';
import catalogRoutes from './routes/catalog';
import staffRoutes from './routes/staff';
import inventoryRoutes from './routes/inventory';
import supplierRoutes from './routes/suppliers';
import financeRoutes from './routes/finance';
import cateringRoutes from './routes/catering';
import incomeRoutes from './routes/income';
import productionRoutes from './routes/production';
import analyticsRoutes from './routes/analytics';
import venueRoutes from './routes/venue.routes';
import quotesRoutes from './routes/quotes';
import exportsRoutes from './routes/exports';

import { prisma } from './prisma'; // Use singleton

// Middlewares & Utils
import { corsMiddleware } from './middleware/cors';
import { helmetMiddleware } from './middleware/helmet';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import { healthCheck } from './health';
import { logger } from './utils/logger';

// Global Error Handlers for debugging (moved up)
process.on('uncaughtException', (err) => {
    console.error('❌ [FATAL] Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ [FATAL] Unhandled Rejection at:', promise, 'reason:', reason);
});

const app = express();

// 🔒 Emergency Root Check - MUST BE FIRST
app.get("/", (_req, res) => {
    res.status(200).send("OK");
});
// Default to 3000 if PORT is not set
console.log('🔍 [DEBUG] Env PORT:', process.env.PORT);
const PORT = process.env.PORT || 3000;
// const prisma = new PrismaClient(); // Removed local instance

// Global Middlewares
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(apiLimiter);
// app.use(sanitizeMiddleware);

// Request Logger
app.use((req, res, next) => {
    logger.http(`${req.method} ${req.url}`);
    next();
});

// Health Check
app.get('/health', healthCheck);

// API Routes
app.use('/api/clients', clientRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/catalog', catalogRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/income', incomeRoutes);
app.use('/api/catering', cateringRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/venues', venueRoutes);
console.log('🔍 [DEBUG] Registering routes...');
app.use('/api/analytics', analyticsRoutes);
app.use('/api/quotes', quotesRoutes);
app.use('/api/events', exportsRoutes);

// Error Handler (Must be last)
app.use(errorHandler);

console.log(`🔍 [DEBUG] Attempting to listen on port ${PORT}...`);
const server = app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`✅ [DEBUG] Server successfully bound to port ${PORT}`);
    logger.info(`Server running on http://localhost:${PORT}`);
});

// Graceful Shutdown Implementation
const gracefulShutdown = async (signal: string) => {
    console.log(`🛑 [INFO] ${signal} received. Shutting down gracefully...`);

    try {
        await new Promise<void>((resolve, reject) => {
            server.close((err) => {
                if (err) {
                    console.error('❌ [ERROR] Error closing HTTP server:', err);
                    reject(err);
                } else {
                    console.log('✅ [INFO] HTTP server closed.');
                    resolve();
                }
            });
        });

        await prisma.$disconnect();
        console.log('✅ [INFO] Database connection closed.');
        process.exit(0);
    } catch (err) {
        console.error('❌ [ERROR] Error during graceful shutdown:', err);
        process.exit(1);
    }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
