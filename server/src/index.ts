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
import productionRoutes from './routes/production';
import analyticsRoutes from './routes/analytics';
import venueRoutes from './routes/venue.routes';
import quotesRoutes from './routes/quotes';
// import exportsRoutes from './routes/exports'; // Added exports route (DISABLED FOR DEBUG)

// ... (lines 20-75 unchanged) ...

app.use('/api/catering', cateringRoutes);
app.use('/api/production', productionRoutes);
app.use('/api/venues', venueRoutes);
console.log('🔍 [DEBUG] Registering routes...');
app.use('/api/analytics', analyticsRoutes);
app.use('/api/quotes', quotesRoutes);
// app.use('/api/events', exportsRoutes); // Register exports route (DISABLED FOR DEBUG)

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

    server.close(() => {
        console.log('✅ [INFO] HTTP server closed.');
    });

    try {
        await prisma.$disconnect();
        console.log('✅ [INFO] Database connection closed.');
        process.exit(0);
    } catch (err) {
        console.error('❌ [ERROR] Error during database disconnection:', err);
        process.exit(1);
    }
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
