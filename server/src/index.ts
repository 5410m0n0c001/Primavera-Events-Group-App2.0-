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

import { timingMiddleware, diagnosticEndpoints } from './debug';

const app = express();
let isDbReady = false;

// 🛡️ Security: Trust Proxy (Required for Coolify/Traefik & Rate Limiter)
app.set('trust proxy', 1);

// 🔒 Emergency Root Check - MUST BE FIRST
app.get("/", (_req, res) => {
    res.status(200).send("OK");
});

// Default to 3000 if PORT is not set
console.log('🔍 [DEBUG] Env PORT:', process.env.PORT);
const PORT = process.env.PORT || 3000;

// Global Middlewares
app.use(timingMiddleware); // ⏱️ Timing Middleware (First)
app.use(helmetMiddleware);
app.use(corsMiddleware);
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(apiLimiter);

// Request Logger
app.use((req, res, next) => {
    logger.http(`${req.method} ${req.url}`);
    next();
});

// ✅ Health Checks - MUST BE BEFORE DB CHECK
// This one is used by Docker/Coolify to verify container is running
app.get('/api/debug/health', (req, res) => {
    res.json({
        status: 'ok',
        dbReady: isDbReady
    });
});

app.get('/health', healthCheck);

// 🚧 Database Readiness Middleware
app.use('/api', (req, res, next) => {
    // Skip if DB is ready
    if (isDbReady) return next();

    // Allow specific bypasses if needed (e.g. static assets, though mostly handled by nginx)

    console.warn(`⚠️ [WARN] Request ${req.method} ${req.url} blocked - Database initializing`);
    res.status(503).json({
        error: 'Service Unavailable',
        message: 'System is initializing database connection. Please try again in 5 seconds.',
        retryAfter: 5
    });
});

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

diagnosticEndpoints(app); // 🩺 Diagnostic Endpoints

// Error Handler (Must be last)
app.use(errorHandler);

const MAX_RETRIES = 10;
const INITIAL_RETRY_DELAY = 1000; // 1 second

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const connectDataWithRetry = async (retryCount = 0): Promise<void> => {
    try {
        console.log(`🔍 [DEBUG] Connecting to database... (Attempt ${retryCount + 1}/${MAX_RETRIES})`);
        await prisma.$connect();

        // Simple query to verify connection
        // await prisma.$queryRaw`SELECT 1`; 

        console.log('✅ [DEBUG] Database connected successfully.');
        isDbReady = true;
    } catch (error) {
        if (retryCount >= MAX_RETRIES) {
            console.error('❌ [FATAL] Failed to connect to database after maximum retries:', error);
            // We might want to keep the server running but unavailable, 
            // or exit. Exiting lets Docker restart it, but might loop. 
            // Better to keep it up but reporting 503 or unhealthy on deep health checks.
            // For now, let's exit to force a restart if it's truly broken long-term.
            process.exit(1);
        }

        const delay = INITIAL_RETRY_DELAY * Math.pow(2, retryCount); // Exponential backoff
        console.warn(`⚠️ [WARN] Database connection failed. Retrying in ${delay}ms...`);
        console.error('Error details:', error);

        await wait(delay);
        return connectDataWithRetry(retryCount + 1);
    }
};

const startServer = async () => {
    try {
        // 🚀 1. Start Server IMMEDIATELY
        const server = app.listen(Number(PORT), '0.0.0.0', () => {
            console.log(`✅ [DEBUG] Server successfully bound to port ${PORT} (Waiting for DB)`);
            logger.info(`Server running on http://localhost:${PORT}`);
        });

        // 🔧 Optimization: Adjust Keep-Alive Timeouts
        server.keepAliveTimeout = 75000;
        server.headersTimeout = 76000;

        // 🛢️ 2. Connect Database in background
        // We don't await this here so startServer finishes and app is responsive
        connectDataWithRetry().catch(err => {
            console.error("❌ [FATAL] Final DB connection failure:", err);
            // process.exit(1); // handled inside retry
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

    } catch (error) {
        console.error('❌ [FATAL] Server startup failed:', error);
        process.exit(1);
    }
};

startServer();
