import express from 'express';
import cors from 'cors';
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

// ... other imports ...

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

// Removed inline PDF generation in favor of api/quotes/generate-pdf
// app.post('/api/quotes/generate-pdf' ... handled in quotesRoutes

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
