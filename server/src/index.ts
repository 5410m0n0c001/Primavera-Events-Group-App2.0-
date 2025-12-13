import express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import clientRoutes from './routes/clients';
import calendarRoutes from './routes/calendar';
import catalogRoutes from './routes/catalog';
import staffRoutes from './routes/staff';
import inventoryRoutes from './routes/inventory';
import supplierRoutes from './routes/suppliers';
import financeRoutes from './routes/finance';
import cateringRoutes from './routes/catering';
import productionRoutes from './routes/production';
import analyticsRoutes from './routes/analytics';
import venueRoutes from './routes/venue.routes';
import quotesRoutes from './routes/quotes';

// Middlewares & Utils
import { corsMiddleware } from './middleware/cors';
import { helmetMiddleware } from './middleware/helmet';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
// import { sanitizeMiddleware } from './middleware/sanitize'; // Optional, can enable if strict strict needed
import { healthCheck } from './health';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const prisma = new PrismaClient();

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
app.use('/api/catering', cateringRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/quotes', quotesRoutes);

// Error Handler (Must be last)
app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
});
